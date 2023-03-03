class LiveList {
  constructor(ydoc, name) {
    // values should be private?
    this.values = ydoc.getArray(name);
  }

  // Removes all the elements.
  clear() {

  }

  // Tests whether all elements pass the test implemented by the provided function.
  // Returns true if the predicate function returns a truthy value for every element. Otherwise, false.
  every(callback) {

  }

  // Tests whether at least one element in the LiveList passes the test implemented by the provided function.
  some(callback) {

  }

  // Creates an array with all elements that pass the test implemented by the provided function.
  filter(callback) {

  }

  // Returns the first element that satisfies the provided testing function.
  find(callback) {

  }

  // Inserts one element at a specified index.
  insert(index, element) {
    this.values.insert(index, [element]);  
  }

  // Returns the last index at which a given element can be found in the LiveList, or -1 if it is not present.
  // The LiveList is searched backwards, starting at fromIndex.
  lastIndexOf(element) {

  }

  // Adds one element to the end of the LiveList.
  push(element) {
    this.values.push([element]);
  }

  // yjs
  unshift(element) {
    this.values.unshift([element]);
  }

  // yjs
  delete(index, length) {
    this.values.delete(index, length);
  }

  // Get the element at the specified index.
  get(index) {
    return this.values.get(index);
  }

  // Returns the first index at which a given element can be found in the LiveList, or -1 if it is not present.
  indexOf(element) {

  }

  slice(start, end) {
    return this.values.slice(start, end);
  }

  // Returns the number of elements.
  length() {
    return this.values.length;
  }

  // Executes a provided function once for each element.
  forEach(callback) {
    this.values.forEach(callback);
  }

  // Creates an array populated with the results of calling a provided function on every element.
  map(callback) {

  }

  // Moves one element at a specified index.
  move(oldIndex, newIndex) {

  }

  // Replace one element at the specified index.
  // https://liveblocks.io/docs/api-reference/liveblocks-client#LiveList.set
  set(index, element) {

  }

  // Transforms the LiveList into a normal JavaScript array.
  // Will be deprecated in the future
  // Starting with 0.18, we recommend toImmutable instead. It’s faster, cached, and leads to fewer surprises.
  toArray() {
    return this.values.toArray();
  }

  // Returns an immutable JavaScript array that is equivalent to the LiveList. Nested values will also be immutable.
  toImmutable() {
    
  }

  // yjs
  toJSON() {

  }

  // yjs
  // should be private? use room.subscribe to observe changes
  observe(callback) {
    this.values.observe(callback);
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

export default LiveList;