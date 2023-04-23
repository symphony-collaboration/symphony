import History from "./History.js";

/**
 * @classdesc The SyncedMap is a shared type that is similar to the JavaScript Map.
 * @hideconstructor
 */

class SyncedMap {
  // values is private
  #values;

  constructor(ydoc, name) {
    this.#values = ydoc.getMap(name);
  }

  /** Removes the specified entry from the SyncedMap by key. Returns true if the entry existed and has been removed, or false if it did not exist.*/
  delete(key) {
    this.#values.delete(key);
  }

  /** Returns a new Iterator object of [key, value] pairs for each entry in the SyncedMap.*/ 
  entries() {
    return this.#values.entries();
  }

  /** Calls the provided function once for each [key, value] pair of the SyncedMap.*/
  forEach(callback) {
    this.#values.forEach(callback);
  }

  /** Returns a specified entry from the SyncedMap.*/
  get(key) {
    return this.#values.get(key);
  }

  /** Returns a Boolean indicating whether the SyncedMap contains an entry with the specified key or not.*/
  has(key) {
    return !!this.get(key);
  }

  /** Returns a new Iterator object containing the keys for each entry in the SyncedMap.*/
  keys() {
    return this.#values.keys();
  }

  /** Adds or updates an entry in the SyncedMap with a specified key and a value.*/
  set(key, value) {
    this.#values.set(key, value);
  }

  /** Returns the number of elements in the SyncedMap.*/
  size() {
    return this.#values.size;
  }

  /** Returns a new Iterator object that contains the the #values for each entry in the SyncedMap.*/
  values() {
    return this.#values.values();
  }

  /** Removes all elements from the SyncedMap.*/
  clear() {
    this.#values.clear();
  }
  
  /** Returns a JSON representation of the SyncedMap.*/
  toJSON() {
    return this.#values.toJSON();
  }

  /** Returns a new History object that can be used to undo/redo the current client's changes.*/
  newHistory(captureTimeout=0) {
    return new History(this.#values, captureTimeout);
  }

  /** Returns a new SyncedMap with the same #values as the caller.*/
  copy() {
    return this.#values.clone();
  }

  observe(callback) {
    this.#values.observe(callback);
  }

  unobserve(callback) {
    this.#values.unobserve(callback);
  }
}

export default SyncedMap;
