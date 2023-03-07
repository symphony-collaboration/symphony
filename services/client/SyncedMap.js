class SyncedMap {
  constructor(ydoc, name) {
    // values should be private
    this.values = ydoc.getMap(name);
  }

  // Removes the specified element by key. Returns true if an element existed and has been removed, or false if the element does not exist.
  delete(key) {
    this.values.delete(key);
  }

  // Returns a new Iterator object that contains the [key, value] pairs for each element.
  entries() {
    return this.values.entries();
  }

  // Executes a provided function once per each key/value pair in the Map object.
  forEach(callback) {
    this.values.forEach(callback);
  }

  // Returns a specified element from the SyncedMap or undefined if the key can’t be found.
  get(key) {
    return this.values.get(key);
  }

  // Returns a boolean indicating whether an element with the specified key exists or not.
  has(key) {
    return !!this.get(key);
  }

  // Returns a new Iterator object that contains the keys for each element.
  keys() {
    return this.values.keys();
  }

  // Adds or updates an element with a specified key and a value.
  set(key, value) {
    this.values.set(key, value);
  }

  // Returns the number of elements in the SyncedMap.
  size() {
    return this.values.size;
  }

  // Returns a new Iterator object that contains the the values for each element.
  values() {
    return this.values.values();
  }

  // Returns an immutable ES6 Map that is equivalent to the SyncedMap. Nested values will also be immutable.
  toImmutable() {

  }

  // yjs
  // Removes all elements from the SyncedMap
  clear() {
    this.values.clear();
  }
  
  // yjs
  // Do we need this?
  toJSON() {
    return this.values.toJSON();
  }

  // yjs - Clone all values into a fresh Y.Map instance. The returned type can be included into the Yjs document.
  // Rename?
  clone() {
    return this.values.clone();
  }

  // yjs
  // I don't think we need this - Room.subscribe calls the yjs observe method directly
  observe(callback) {

  }

  // yjs
  unobserve(callback) {

  }

  // yjs
  observeDeep(callback) {

  }

  // yjs
  unobserveDeep(callback) {

  }
}

export default SyncedMap;