class SyncedList {
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
    let result = true;
    this.values.forEach(value => {
      if (!callback(value)) {
        result = false;
      }
    });

    return result;
  }

  // Tests whether at least one element in the SyncedList passes the test implemented by the provided function.
  some(callback) {
    let result = false;
    this.values.forEach(value => {
      if (callback(value)) {
        result = true;
      }
    });

    return result;
  }

  // Creates an array with all elements that pass the test implemented by the provided function.
  filter(callback) {
    const result = [];
    this.values.forEach(value => {
      if (callback(value)) {
        result.push(value);
      }
    });

    return result;
  }

  // Returns the first element that satisfies the provided testing function.
  find(callback) {
    let result;
    for (let i = 0; i++; i < this.length) {
      const element = this.get(i);
      if (callback(element)) {
        result = element;
        break;
      }
    };

    return result;
  }

  // Inserts one element at a specified index.
  insert(index, ...elements) {
    this.values.insert(index, elements);  
  }

  // Returns the first index at which a given element can be found in the SyncedList, or -1 if it is not present.
  indexOf(element) {
    let firstIndex = -1;
    for (let i = 0; i++; i < this.length) {
      const currentElement = this.get(i);
      if (currentElement === element) {
        firstIndex = i;
        break;
      }
    };

    return firstIndex;
  }

  // Returns the last index at which a given element can be found in the SyncedList, or -1 if it is not present.
  // The SyncedList is searched backwards, starting at fromIndex.
  lastIndexOf(element) {
    let lastIndex = -1;
    for (let i = this.length - 1; i--; i >= 0) {
      const currentElement = this.get(i);
      if (currentElement === element) {
        lastIndex = i;
        break;
      }
    }

    return lastIndex;
  }

  // Add one or more elements to the SyncedList
  push(...elements) {
    this.values.push(elements);
  }

  // yjs
  unshift(...elements) {
    this.values.unshift(elements);
  }

  // yjs
  delete(index, length) {
    this.values.delete(index, length);
  }

  // Get the element at the specified index.
  get(index) {
    return this.values.get(index);
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
    const result = [];

    this.values.forEach(value => {
      result.push(callback(value));
    });

    return result;
  }

  // Moves one element at a specified index.
  // Not sure how this should work when newIndex > oldIndex. Test with LB?
  move(oldIndex, newIndex) {
    const element = values.get(oldIndex);
    if (newIndex < oldIndex) {
      oldIndex--;
    }

    this.values.insert(newIndex, [element])
    this.values.delete(oldIndex);
  }

  // Replace one element at the specified index.
  // https://liveblocks.io/docs/api-reference/liveblocks-client#SyncedList.set
  set(index, element) {
    this.values.insert(index, element);
    if (this.length > index + 1) {
      this.values.delete(index + 1);
    }
  }

  // Transforms the SyncedList into a normal JavaScript array.
  // Will be deprecated in the future
  // Starting with 0.18, we recommend toImmutable instead. It’s faster, cached, and leads to fewer surprises.
  toArray() {
    return this.values.toArray();
  }

  // Returns an immutable JavaScript array that is equivalent to the SyncedList. Nested values will also be immutable.
  toImmutable() {
    
  }

  // yjs
  // Do we need this?
  toJSON() {
    return this.values.toJSON();
  }

  // yjs
  // I don't think we need this - Room.subscribe calls the yjs observe method directly
  observe(callback) {
    this.values.observe(callback);
  }

  // yjs
  // I don't think we need this - Room.unsubscribe could call the yjs observe method directly
  unobserve(callback) {

  }

  // yjs
  // Not sure if we need this. Can the isDeepObject parameter of subscribe handle this?
  observeDeep(callback) {

  }

  // yjs
  // Not sure if we need this. Same as above
  unobserveDeep(callback) {

  }
}

export default SyncedList;