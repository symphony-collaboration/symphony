import * as Y from 'yjs';
import { WebsocketProvider } from 'y-websocket';
import * as awarenessProtocol from 'y-protocols/awareness.js';

import Room from './Room.js';

/**
 * @classdesc Client object that can be used to connect to a Room.
 */

export class SymphonyClient {
  #websocketUrl;
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
    const ydoc = new Y.Doc();
    const wsProviderOptions = {
      connect: shouldInitiallyConnect,
      awareness: new awarenessProtocol.Awareness(ydoc),
    }

    // possible to set up initial presence and initial storage here?
    this.#wsProvider = new WebsocketProvider(this.#websocketUrl, roomId, ydoc, wsProviderOptions);
    return new Room(this.#wsProvider, ydoc, roomId);
  }

  /** Leaves a room.*/
  leave() {
    if (this.#wsProvider) {
      this.#wsProvider.disconnect();
    }
  }
}
