import * as Y from 'yjs';
import { WebsocketProvider } from 'y-websocket';
import * as awarenessProtocol from 'y-protocols/awareness';

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
  * @returns A new Room object.
  */
  enter(roomId) {
    const ydoc = new Y.Doc();
    const wsProviderOptions = {
      awareness: new awarenessProtocol.Awareness(ydoc),
    }

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
