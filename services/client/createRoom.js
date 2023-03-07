import LiveList from './LiveList.js';
import LiveMap from './LiveMap.js';

const createRoom = (wsProvider, ydoc) => {
  return {
    awareness: wsProvider.awareness,

    // https://liveblocks.io/docs/api-reference/liveblocks-client#Room.subscribe(storageItem)
    subscribe: (subscribedItem, callback, isDeepObject) => {
      if (subscribedItem instanceof LiveList || subscribedItem instanceof LiveMap) {
        subscribedItem.values.observe(callback);
      } else if (subscribedItem === 'others') {
        wsProvider.awareness.on('change', callback);
      }      
    },

    // maybe use this to call yjs unobserve methods
    unsubscribe: (subscribedItem, callback) => {

    },

    // Gets the presence of the current user.
    getPresence: () => {
      
    },

    getClientId: () => {
      console.log(wsProvider);
      return wsProvider.awareness.clientID;
    },

    // Updates the presence of the current user. Only pass the properties you want to update. No need to send the full presence.
    updatePresence: (updatedPresence) => {
      const currentPresence = wsProvider.awareness.getLocalState();
      wsProvider.awareness.setLocalState({
        ...currentPresence,
        ...updatedPresence,
      });
    },

    // Gets all the other users in the Room.
    // [currently this returns all users including the client, like yjs does]
    getOthers: () => {
      return wsProvider.awareness.getStates();
    },

    /* Broadcast an event to other users in the Room.
    Event broadcasted to the room can be listened with Room.subscribe("event"). Takes a payload as first argument. Should be serializable to JSON.

    By default, broadcasting an event acts as a “fire and forget”.
    If the user is not currently in the room, the event is simply discarded.
    With the option shouldQueueEventIfNotReady , the event will be queued and sent once the connection is established. */
    broadcastEvent: () => {

    },

    // Gets the current user. Returns null if it is not yet connected to the room.
    getSelf: () => {

    },

    

    // Batches modifications made during the given function.
    // All the modifications are sent to other clients in a single message.
    // All the subscribers are called only after the batch is over.
    // All the modifications are merged in a single history item (undo/redo).
    // [seems comparable to a yjs transaction]
    batch: () => {

    },

    // Room’s history contains functions that let you undo and redo operation
    // made on by the current client on the presence and storage.
    // https://liveblocks.io/docs/api-reference/liveblocks-client#Room.history
    history: () => {
      // return {
      //   undo, redo, pause, resume, canUndo, canRedo
      // }
    },

    // Get the storage status.
    // not-loaded: Initial state when entering the room.
    // loading: Once the storage has been requested via room.getStorage().
    // synchronizing: When some local updates have not been acknowledged by Liveblocks servers.
    // synchronized: Storage is in sync with Liveblocks servers.
    getStorageStatus: () => {

    },

    // Close the room connection and try to reconnect.
    reconnect: () => {
      
    },

    // Get the room’s storage asynchronously (returns a Promise). The storage’s root is a LiveObject.
    getStorage: async () => {
      // return { root }
    },

    newArray: (name) => {
      return new LiveList(ydoc, name);
    },

    newMap: (name) => {
      return new LiveMap(ydoc, name);
    },

    transact: (callback, origin) => {
      ydoc.transact(callback, origin);
    }
  }
};

export default createRoom;