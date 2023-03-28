import * as Y from 'yjs';
import { WebsocketProvider } from 'y-websocket';
import * as awarenessProtocol from 'y-protocols/awareness';
import { IndexeddbPersistence } from 'y-indexeddb';

import Room from './Room.js';

/**
 * @classdesc Client object that can be used to connect to a Room.
 */

export class SymphonyClient {
  #websocketUrl;
  #rooms;

  constructor(websocketUrl) {
    this.#rooms = {};
    this.#websocketUrl = websocketUrl;
  }

  /** Enters a room and returns it.
  * 
  * @param {string} roomId 
  * @returns A new Room object.
  */
  enter(roomId) {
    const ydoc = new Y.Doc();
    const wsProviderOptions = {
      awareness: new awarenessProtocol.Awareness(ydoc),
    }
    new IndexeddbPersistence(roomId, ydoc);
    const wsProvider = new WebsocketProvider(this.#websocketUrl, roomId, ydoc, wsProviderOptions);
    this.#rooms[roomId] = wsProvider;
    return new Room(wsProvider, ydoc, roomId);
  }

  /** Leaves a room.*/
  leave(roomId) {
    const wsProvider = this.#rooms[roomId];
    if (wsProvider) {
      wsProvider.disconnect();
    }
  }
}
