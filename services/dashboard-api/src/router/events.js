/** @module eventsAPI */
const eventsRouter = require('express').Router();
require("dotenv").config();
const { SERVER } = require("../server.config.js");
const changeDashboardStatus = require("../utils/changeDashboardStatus.js");
const {getAllTasksForService} = require("../utils/getActiveServers.js");

let clients = [];
const events = {};

const activateServerUpdates = async(serverIp) => {
  try {
    console.log("activating server updates for ", {serverIp});

    const docConns = await changeDashboardStatus(serverIp, true);
    console.log({docConns})
    docConns.forEach(record => {
      const [docName, conns] = Object.entries(record)[0];

      events[docName] = events[docName] ? events[docName] + conns : conns;
    })
  } catch(e) {
    console.log("failed to activate dashboard on remote server", {serverIp, e})
  }
};

const deactiveServerUpdates = async(serverIp) => {
  try {
    await changeDashboardStatus(serverIp, false);
  } catch (e) {
    console.log("failed to deactivate dashboard on remote server", {serverIp, e})
  }
}

const sendEventsToAll = () => {
  clients.forEach(client => client.res.write(`data: ${JSON.stringify(events)}\n\n`))
}

/** Open a connection and wait for updates */
eventsRouter.get("/events", async(req, res) => {
  const headers = {
    'Content-Type': 'text/event-stream',
    'Connection': 'keep-alive',
    'Cache-Control': 'no-cache'
  };

  res.writeHead(200, headers);

  const clientId = Date.now();
  const newClient = {
    id: clientId,
    res
  };

  clients.push(newClient);
  console.log("in open connect", {clients})

  /* if first client initialize events */
  if (clients.length === 1) {
    //////////////// LOCAL 
    const allServers = await getAllTasksForService();
    console.log({allServers});

    const getServerConnsUpdates = allServers.map(serverIp => activateServerUpdates(serverIp));
    
    try {
      await Promise.all(getServerConnsUpdates);
    } catch(e) {
      console.log("failed to make PUT /dashboard request to remote server(s)")
    }
  }

  const data = `data: ${JSON.stringify(events)}\n\n`;
  res.write(data);

  req.on("close", async() => {
    clients = clients.filter(client => client.id !== clientId);

    console.log("closed connection", {inactive: !clients.length});

    // if no more clients viewing dashboard
    if (!clients.length) {
      console.log("setting dashboard status to inactive on remote servers");

  //////////////// LOCAL 
      const servers = await getAllTasksForService();
      // servers.forEach(async(serverIp) => await changeDashboardStatus(serverIp, false));
      
      // reset events or accumulates
      Object.keys(events).forEach(key => delete events[key]);
      const turnOffServerUpdates = servers.map(serverIp => deactiveServerUpdates(serverIp));
      
      try {
        await Promise.all(turnOffServerUpdates);
      } catch(e) {
        console.log("failed to deactive dashboard on remote server(s)");
      }

    }
  });
});

/** Send an operation to update a rooms connections tally */
eventsRouter.post("/events", (req, res) => {
  console.log("in /events route");
  const { room, add } = req.body;
  events[room] = events[room] || 0;
  events[room] += Number(add);

  if (events[room] === 0) delete events[room];

  res.json(events);
  return sendEventsToAll();
});


/**  let containers query to set dashboard status on startup/ scale up**/
eventsRouter.get("/events/clients", (req, res) => {
// route for remote servers when they spin up
  // if clients.length, return an activate response
  // else do not activate dashboard status 
  const active = !!clients.length;
  const eventsUrl = `http://${SERVER.ip}:${process.env.PORT}/api/events`;

  res.json({active, eventsUrl});
})

module.exports = eventsRouter;
