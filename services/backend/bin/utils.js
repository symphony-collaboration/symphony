const Y = require('yjs')
const syncProtocol = require('y-protocols/dist/sync.cjs')
const awarenessProtocol = require('y-protocols/dist/awareness.cjs')

const encoding = require('lib0/dist/encoding.cjs')
const decoding = require('lib0/dist/decoding.cjs')
const map = require('lib0/dist/map.cjs')

const debounce = require('lodash.debounce')

const WebSocket = require("ws");

const callbackHandler = require('./callback.js').callbackHandler
const isCallbackSet = require('./callback.js').isCallbackSet

const { pg, pgExecute } = require("../src/PostgresClient");

const { docs, dashboard } = require("../server.config.js");

const {pub, sub} = require("./redis.js");
const getDocState = require("./getDocState.js");

const { getRoomIps, updateRoomIps, deleteRoomIp } = require("../src/DynamoClient.js")

const axios = require("axios");

const CALLBACK_DEBOUNCE_WAIT = parseInt(process.env.CALLBACK_DEBOUNCE_WAIT) || 2000
const CALLBACK_DEBOUNCE_MAXWAIT = parseInt(process.env.CALLBACK_DEBOUNCE_MAXWAIT) || 10000

const wsReadyStateConnecting = 0
const wsReadyStateOpen = 1
const wsReadyStateClosing = 2 // eslint-disable-line
const wsReadyStateClosed = 3 // eslint-disable-line

// disable gc when using snapshots!
const gcEnabled = process.env.GC !== 'false' && process.env.GC !== '0'
const persistenceDir = process.env.YPERSISTENCE

const Persistence = require('../src/Persistence.js');

const storage = new Persistence();

const persistence = {
  provider: storage,
  bindState: async (docName, ydoc) => {
    // array of ip addresses of servers with the doc in memory or null
    let remoteServers
    try {
      // retrieve ip addresses of servers from DynamoDB
      remoteServers = await getRoomIps(docName);
    } catch(e) {
      console.log({e});
    }

    // if the doc is in memory on another server
    if (remoteServers) {

      // resolve promise on first sucessful retrieval of a remote doc
      const upToDate = await new Promise(resolve => 
        
        remoteServers.some(async(ip) => {
          try {

            // helper to retrieve the remote doc state
            const currentState = await getDocState(ip, docName);

            if (currentState) {
              Y.applyUpdate(ydoc, currentState);
            };
            resolve(true)
          } catch {
            console.log(ip, "failed to respond or provided invalid doc state" );
            return false;
          }
        }) 
      )

      // don't think this would even reach, promise doesn't resolve to false...
      if (!upToDate) {
        console.log("Failed to retrieve remote state from any of the remote servers in ip string set");
        remoteServers = false;
      }
    }

    // if no other server has doc in memory - first user in room
    if (!remoteServers) {
      // retrieve state from s3
      let persistedState = await storage.getState(docName);

      if (persistedState) {
        Y.applyUpdate(ydoc, persistedState);
      }
    }

    // accounts for scenario where there are write conflicts - probably not necessary
    for (let attempts = 1; attempts <= 3; attempts++) {
      try {
        // update the room ips string set in dynamodb
        await updateRoomIps(docName);
        return;
      } catch(e) {
        console.log("Failed to save ip to dynamo", {e, attempts});

        if (attempts === 3) throw new Error("failed to save ip to dynamo");
      }
    }

    // let state = Y.encodeStateAsUpdate(ydoc);
    // await storage.storeState(docName, state);
  },
  writeState: async (docName, ydoc) => {
    let state = Y.encodeStateAsUpdate(ydoc);
    await storage.storeState(docName, state);
    await storage.setActive(docName, false);
  }
}

exports.persistence = persistence;

exports.setPersistence = persistence_ => {
  persistence = persistence_
}

exports.getPersistence = () => persistence

// exporting docs so that others can use it
exports.docs = docs

const messageSync = 0
const messageAwareness = 1

const updateLocalClients = (update, doc) => {
  const encoder = encoding.createEncoder()
  encoding.writeVarUint(encoder, messageSync)
  syncProtocol.writeUpdate(encoder, update)
  const message = encoding.toUint8Array(encoder);

  doc.conns.forEach((_, conn) => send(doc, conn, message))
}

const updateHandler = (update, origin, doc) => {
  let local = origin instanceof WebSocket && doc.conns.has(origin);

  if (local) {
    pub.publishBuffer(doc.name, Buffer.from(update));
  }

  updateLocalClients(update, doc);
}

class WSSharedDoc extends Y.Doc {
  constructor(name) {
    super({ gc: gcEnabled })
    this.name = name;
    this.presenceChannel = `${name}-presence`;
 
    this.conns = new Map();
    this.awareness = new awarenessProtocol.Awareness(this)
    this.awareness.setLocalState(null)
 
    const broadcastAwarenessLocal = ({ added, updated, removed }, conn) => {
      const changedClients = added.concat(updated, removed)
      if (conn !== null) {
        const connControlledIDs = /** @type {Set<number>} */ (this.conns.get(conn))
        if (connControlledIDs !== undefined) {
          added.forEach(clientID => { connControlledIDs.add(clientID) })
          removed.forEach(clientID => { connControlledIDs.delete(clientID) })
        }
      }

      // broadcast awareness update
      const encoder = encoding.createEncoder()
      encoding.writeVarUint(encoder, messageAwareness)
      encoding.writeVarUint8Array(encoder, awarenessProtocol.encodeAwarenessUpdate(this.awareness, changedClients))
      const buff = encoding.toUint8Array(encoder)
      
      this.conns.forEach((_, c) => {
        send(this, c, buff)
      })
    }

    this.awareness.on('update', broadcastAwarenessLocal)
    this.on('update', updateHandler)

    // subscribe to presence and update channel
    sub.subscribe([this.name, this.presenceChannel]).then(() => {
      sub.on('messageBuffer', (channel, update) => {
        const docName = channel.toString();

        if (docName === this.name) {
          Y.applyUpdate(this, update, sub);
          return 
        }

        if (docName === this.presenceChannel) {
          awarenessProtocol.applyAwarenessUpdate(this.awareness, update, sub);
        }
      })
    })

    if (isCallbackSet) {
      this.on('update', debounce(
        callbackHandler,
        CALLBACK_DEBOUNCE_WAIT,
        { maxWait: CALLBACK_DEBOUNCE_MAXWAIT }
      ))
    }
  }

  async destroy() {
    const docName = this.name;
    super.destroy();

    await deleteRoomIp(docName);
    sub.unsubscribe(docName);    
    docs.delete(docName)
  }
}

exports.WSSharedDoc = WSSharedDoc;

const getYDoc = (docname, gc = true) => map.setIfUndefined(docs, docname, () => {
  const docInMemory = docs.get(docname);

  if (docInMemory) return docInMemory;
  
  const doc = new WSSharedDoc(docname)
  doc.gc = gc 

  // retrieve from remote server w/ doc in memory  
  persistence.bindState(docname, doc)

  docs.set(docname, doc);
  return doc;
})

exports.getYDoc = getYDoc

const messageListener = (conn, doc, message) => {

  try {
    const encoder = encoding.createEncoder()
    const decoder = decoding.createDecoder(message)
    const messageType = decoding.readVarUint(decoder)
    switch (messageType) {
      case messageSync:
        encoding.writeVarUint(encoder, messageSync)
        syncProtocol.readSyncMessage(decoder, encoder, doc, conn)

        // If the `encoder` only contains the type of reply message and no
        // message, there is no need to send the message. When `encoder` only
        // contains the type of reply, its length is 1.
        if (encoding.length(encoder) > 1) {
          send(doc, conn, encoding.toUint8Array(encoder))
        }
        break
      case messageAwareness: {
        const update = decoding.readVarUint8Array(decoder);

        // publish awareness update to presence channel
        pub.publish(doc.presenceChannel, Buffer.from(update));

        awarenessProtocol.applyAwarenessUpdate(doc.awareness, update, conn);
        
        break
      }
    }
  } catch (err) {
    console.error(err)
    doc.emit('error', [err])
  }
}

const closeConn = async(doc, conn) => {

  if (doc.conns.has(conn)) {
    const controlledIds = doc.conns.get(conn)

    doc.conns.delete(conn)
    awarenessProtocol.removeAwarenessStates(doc.awareness, Array.from(controlledIds), null);
    
    if (doc.conns.size === 0) {
      
      // if persisted, we store state and destroy ydocument
      persistence.writeState(doc.name, doc).then(() => {
        doc.destroy()
      })
    }

    // send event to update connections tally for room

    if (dashboard.active) {
      axios.post(dashboard.eventsUrl, { room: doc.name, add: -1 }).catch(e => console.log("failed to post disconnect"));
    }
  }

  conn.close()
}

const send = (doc, conn, m) => {
  if (conn.readyState !== wsReadyStateConnecting && conn.readyState !== wsReadyStateOpen) {
    closeConn(doc, conn)
  }
  try {
    conn.send(m, /** @param {any} err */ err => { err != null && closeConn(doc, conn) })
  } catch (e) {
    closeConn(doc, conn)
  }
}

const pingTimeout = 30000

exports.setupWSConnection = (conn, req, { docName = req.url.slice(1).split('?')[0], gc = true } = {}) => {
  conn.binaryType = 'arraybuffer'
  
  // get doc, initialize if it does not exist yet
  const doc = getYDoc(docName, gc, conn)
  doc.conns.set(conn, new Set())
  // listen and reply to events
  conn.on('message', async(message) => {  
    messageListener(conn, doc, new Uint8Array(message))
  });


  // log connection
  pgExecute(async () => pg.connection.create({ data: { roomName: docName } }));

  // send event to update connections tally for room
  if (dashboard.active) {
    axios.post(dashboard.eventsUrl, { room: docName, add: 1 }).catch(e => console.log("failed to post disconnect"));;
  }

  // Check if connection is still alive
  let pongReceived = true
  const pingInterval = setInterval(() => {
    if (!pongReceived) {
      if (doc.conns.has(conn)) {
        closeConn(doc, conn)
      }
      clearInterval(pingInterval)
    } else if (doc.conns.has(conn)) {
      pongReceived = false
      try {
        conn.ping()
      } catch (e) {
        console.log('error: ', e)
        closeConn(doc, conn)
        clearInterval(pingInterval)
      }
    }
  }, pingTimeout)

  conn.on('close', () => {
    closeConn(doc, conn)
    clearInterval(pingInterval)
  })

  conn.on('pong', () => {
    pongReceived = true
  })

  // put the following in a variables in a block so the interval handlers don't keep in in
  // scope
  {
    // send sync step 1
    const encoder = encoding.createEncoder()
    encoding.writeVarUint(encoder, messageSync)
    syncProtocol.writeSyncStep1(encoder, doc)
    send(doc, conn, encoding.toUint8Array(encoder))
    const awarenessStates = doc.awareness.getStates()
    if (awarenessStates.size > 0) {
      const encoder = encoding.createEncoder()
      encoding.writeVarUint(encoder, messageAwareness)
      encoding.writeVarUint8Array(encoder, awarenessProtocol.encodeAwarenessUpdate(doc.awareness, Array.from(awarenessStates.keys())))
      send(doc, conn, encoding.toUint8Array(encoder))
    }
  }
}
