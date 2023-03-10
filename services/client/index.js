import * as Y from 'yjs';
import { WebsocketProvider } from 'y-websocket';
import * as awarenessProtocol from 'y-protocols/awareness.js';

import Room from './createRoom.js';

/**
 * @classdesc Client object that can be used to connect to a Room.
 */

export class SymphonyClient {
  #websocketUrl;
  #currentRoomId;
  #wsProvider;

  constructor(websocketUrl) {
    this.#websocketUrl = websocketUrl;
  }

  /** Enters a room and returns it.
  * 
  * @param {string} roomId 
  * @param {object} initialPresence Not implemented
  * @param {object} initialStorage Not implemented
  * @param {boolean} shouldInitiallyConnect Implemented but if you don't initially connect, can't connect later
  * @returns A new Room object.
  */
  enter(roomId, intialPresence, initialStorage, shouldInitiallyConnect) {
    this.#currentRoomId = roomId;
    const ydoc = new Y.Doc();
    const wsProviderOptions = {
      connect: shouldInitiallyConnect,
      awareness: new awarenessProtocol.Awareness(ydoc),
    }

    // possible to set up initial presence and initial storage here?
    this.#wsProvider = new WebsocketProvider(this.#websocketUrl, roomId, ydoc, wsProviderOptions);
    return new Room(this.#wsProvider, ydoc);
  }

  /** Leaves a room.*/
  leave() {
    if (this.#wsProvider) {
      this.#wsProvider.disconnect();
    }
  }

  // In liveblocks, we get a room by its id. This implies that a client can be in multiple rooms at the same time.
  /** Get the current room Id. Returns <tt>null</tt> if client has not yet entered a room.*/
  getCurrentRoom() {
    return this.#currentRoomId;
  }
}

// /** Creates a new Client object.
//  * 
//  * @param {string} websocketUrl 
//  * @returns A new Client object.
//  */
// export const createClient = (websocketUrl) => {
//   let currentRoomId = null;
//   let wsProvider = null;

//   return {
//     /** Enters a room and returns it.
//      * 
//      * @param {string} roomId 
//      * @param {object} initialPresence Not implemented
//      * @param {object} initialStorage Not implemented
//      * @param {boolean} shouldInitiallyConnect Implemented but if you don't initially connect, can't connect later
//      * @returns A new Room object.
//      */
//     enter: (roomId, intialPresence, initialStorage, shouldInitiallyConnect) => {
//       currentRoomId = roomId;
//       const ydoc = new Y.Doc();
//       const wsProviderOptions = {
//         connect: shouldInitiallyConnect,
//         awareness: new awarenessProtocol.Awareness(ydoc),
//       }

//       // possible to set up initial presence and initial storage here?
//       wsProvider = new WebsocketProvider(websocketUrl, roomId, ydoc, wsProviderOptions);
//       return new Room(wsProvider, ydoc);
//     },

//     /** Leaves a room.*/
//     leave: () => {
//       if (wsProvider) {
//         wsProvider.disconnect();
//       }
//     },

//     // In liveblocks, we get a room by its id. This implies that a client can be in multiple rooms at the same time.
//     /** Get the current room Id. Returns <tt>null</tt> if client has not yet entered a room.*/
//     getCurrentRoom: () => {
//       return currentRoomId;
//     },

//     // Should this be called directly on the types instead?
//     newHistory: (sharedType) => {
//       if (sharedType instanceof SyncedList || sharedType instanceof SyncedMap) {
//         return new Y.UndoManager(sharedType.values());
//       }
//     }
//   }
// }