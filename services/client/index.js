import * as Y from 'yjs';
import { WebsocketProvider } from 'y-websocket';
import * as awarenessProtocol from 'y-protocols/awareness.js';

import createRoom from './createRoom';

export const createClient = (websocketUrl) => {
  let currentRoomId = null;

  return {
    // Enters a room and returns it.
    enter: (roomId, intialPresence, initialStorage, shouldInitiallyConnect) => {
      currentRoomId = roomId;
      const ydoc = new Y.Doc();
      const wsProviderOptions = {
        connect: shouldInitiallyConnect,
        awareness: new awarenessProtocol.Awareness(ydoc),
      }

      // possible to set up initial presence and initial storage here?
      const wsProvider = new WebsocketProvider(websocketUrl, roomId, ydoc, wsProviderOptions);
      return createRoom(wsProvider, ydoc);
    },

    // Leaves a room.
    leave: () => {
      
    },

    // get a room by id. returns null if client.enter has not been called previously.
    getRoom: (roomId) => {
      return currentRoomId;
    },
    
  }
}