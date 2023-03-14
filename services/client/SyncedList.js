import History from "./History.js";

/**
 * @classdesc The SyncedList is a shared type that is similar to the JavaScript Array.
 * @hideconstructor
 */

class SyncedList {
  // #values is private
  #values;

  constructor(ydoc, name) {
    this.#values = ydoc.getArray(name);
  }

  /** Removes all elements from the SyncedList.*/
  clear() {
    this.#values.delete(0, this.length);
  }

  /** Checks whether all elements in the SyncedList pass the test implemented by the provided function, and returns a Boolean value.*/
  every(callback) {
    let result = true;
    this.#values.forEach(value => {
      if (!callback(value)) {
        result = false;
      }
    });

    return result;
  }

  /** Checks whether at least one element in the SyncedList passes the test implemented by the provided function, and returns a Boolean value.*/
  some(callback) {
    let result = false;
    this.#values.forEach(value => {
      if (callback(value)) {
        result = true;
      }
    });

    return result;
  }

  /** Returns a new array containing all elements in the SyncedList that pass the test implemented by the provided function.*/
  filter(callback) {
    const result = [];
    this.#values.forEach(value => {
      if (callback(value)) {
        result.push(value);
      }
    });

    return result;
  }

  /** Returns the first element in the SyncedList that satisfies the provided testing function.*/
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

  /** Inserts one or more elements at the specified index.*/
  insert(index, ...elements) {
    this.#values.insert(index, elements);  
  }

  /** Returns the first index at which a given element can be found in the SyncedList, or -1 if not present.*/
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

  /** Returns the index of the last occurrence of the specified element in the SyncedList, or -1 if not present.*/
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

  /** Adds one or more elements to the SyncedList and returns the new length of the SyncedList.*/
  push(...elements) {
    this.#values.push(elements);
    return this.length;
  }

  /** Adds one or more elements to the beginning of the SyncedList and returns the new length of the SyncedList.*/
  unshift(...elements) {
    this.#values.unshift(elements);
    return this.length;
  }

  /**  Removes <tt>length</tt> elements from the SyncedList starting at the specified index.*/
  delete(index, length) {
    this.#values.delete(index, length);
  }

  /** Returns the element at the specified index of the SyncedList.*/
  get(index) {
    return this.#values.get(index);
  }

  /** Returns an array containing the elements of the SyncedList from <tt>start</tt> to <tt>end</tt> (non-inclusive).
   * @param {number} start - The index at which to start extraction.
   * @param {number} end - The index at which to end extraction (non-inclusive).
  */
  slice(start, end) {
    return this.#values.slice(start, end);
  }

  /** Returns the number of elements of the SyncedList.*/
  get length() {
    return this.#values.length;
  }

  /** Calls the provided function once for each element of the SyncedList.*/
  forEach(callback) {
    this.#values.forEach(callback);
  }

  /** Returns an array containing the elements of the SyncedList for which the provided function returns a truthy value.*/
  map(callback) {
    const result = [];

    this.#values.forEach(value => {
      result.push(callback(value));
    });

    return result;
  }

  // Not sure how this should work when newIndex > oldIndex. Test with LB?
  /** Moves the element at a specified index of the SyncedList to a new index. 
   * @param {number} oldIndex - The index of the element to be moved.
   * @param {number} newIndex - The index to where the element will be moved.
  */
  move(oldIndex, newIndex) {
    // Return early if newIndex doesn't exist
    if (newIndex >= this.length || newIndex <= 0) return;
    const element = this.#values.get(oldIndex);
    if (newIndex < oldIndex) {
      oldIndex--;
    }

    this.#values.insert(newIndex, [element])
    this.#values.delete(oldIndex);
  }

  // https://liveblocks.io/docs/api-reference/liveblocks-client#SyncedList.set
  /** Replaces the element at the specified index of the SyncedList with the provided element.*/
  set(index, element) {
    if (index >= this.length || index <= 0) return;
    this.#values.insert(index, element);
    if (this.length > index + 1) {
      this.#values.delete(index + 1);
    }
  }

  values() {
    return this.#values.values();
  }

  /** Returns an array containing all the elements of the SyncedList.*/
  toArray() {
    return this.#values.toArray();
  }

  newHistory(captureTimeout=0) {
    return new History(this.#values, captureTimeout);
  }

  // Returns an immutable JavaScript array that is equivalent to the SyncedList. Nested values will also be immutable.
  // toImmutable() {
    
  // }

  // yjs
  // Do we need this?
  /** Returns a JSON representation of the SyncedList.*/
  toJSON() {
    return this.#values.toJSON();
  }

  
  observe(callback) {
    this.#values.observe(callback);
  }

  unobserve(callback) {
    this.#values.unobserve(callback);
  }

  // yjs
  // I don't think we need this - Room.subscribe calls the yjs observe method directly
  // observe(callback) {
    
  // }

  // yjs
  // I don't think we need this - Room.unsubscribe could call the yjs observe method directly
  // unobserve(callback) {

  // }

  // yjs
  // Not sure if we need this. Can the isDeepObject parameter of subscribe handle this?
  // observeDeep(callback) {

  // }

  // yjs
  // Not sure if we need this. Same as above
  // unobserveDeep(callback) {

  // }
}

export default SyncedList;