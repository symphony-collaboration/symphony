import SyncedList from './SyncedList.js';
import SyncedMap from './SyncedMap.js';
import * as Y from 'yjs';

/**
 * @classdesc Room object returned when calling <tt>Client.enter</tt>.
 * @hideconstructor
 */
class Room {
  #wsProvider;
  #ydoc;
  #roomId;

  constructor(wsProvider, ydoc, roomId) {
    this.#wsProvider = wsProvider;
    this.#ydoc = ydoc;
    this.#roomId = roomId;
  }

  /** Subscribes to updates for an item.
   * If the <tt>subscribedItem</tt> is a SyncedList or SyncedMap, the provided callback is executed whenever that shared type changes.
   * If the <tt>subscribedItem</tt> is <tt>'others'</tt>, the provided callback is executed whenever another client's presence changes.
   * 
   * @param {SyncedList | SyncedMap | string} subscribedItem 
   * @param {function} callback 
   */
  subscribe(subscribedItem, callback) {
    if (subscribedItem instanceof SyncedList || subscribedItem instanceof SyncedMap) {
      subscribedItem.observe(callback);
    } else if (subscribedItem === 'others') {
      this.#wsProvider.awareness.on('change', callback);
    }      
  }

  /** Stops subscribing to the SyncedList or SyncedMap passed as an argument.*/
  unsubscribe(subscribedItem, callback) {
    if (subscribedItem instanceof SyncedList || subscribedItem instanceof SyncedMap) {
      subscribedItem.unobserve(callback);
    }
  }

  /** Returns the Room id.*/
  getRoomId() {
    return this.#roomId;
  }

  // Gets the presence of the current user.
  // getPresence() {
    
  // }

  /** Returns the id of the client.*/
  getClientId() {
    return this.#wsProvider.awareness.clientID;
  }

  /** Updates the presence of the client. Properties passed as arguments will be updated, while other properties of presence will remain unchanged.*/
  updatePresence(updatedPresence) {
    const currentPresence = this.#wsProvider.awareness.getLocalState();
    this.#wsProvider.awareness.setLocalState({
      ...currentPresence,
      ...updatedPresence,
    });
  }

  /** Returns all other users in the Room.*/
  getOthers() {
    return this.#wsProvider.awareness.getStates();
  }

  /**  Merges operations in the callback function into a single operation.*/
  bundle(callback) {
    this.#ydoc.transact(callback);
  }

  /** Returns a new top-level SyncedList.*/
  newList(name) {
    return new SyncedList(this.#ydoc, name);
  }

  /** Returns a new top-level SyncedMap.*/
  newMap(name) {
    return new SyncedMap(this.#ydoc, name);
  }

  /** Returns a new SyncedList that can be nested within another synced type.*/
  newNestedList() {
    return new Y.Array();
  }

  /** Returns a new SyncedMap that can be nested within another synced type.*/
  newNestedMap() {
    return new Y.Map();
  }
}

export default Room;
