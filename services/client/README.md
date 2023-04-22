# Symphony Client

The Symphony client is used to connect the frontend of an application to the Symphony backend server.

## Getting Started

Install the Symphony client:

```
npm install @symphony-rtc/client
```

Require the client module in your application:

```
import { SymphonyClient } from @symphony-rtc/client
```

Instantiate a new Symphony Client that can be used to connect to a Room:

```
const client = new SymphonyClient(websocketUrl)
```

## API

### SymphonyClient

`enter(roomId)`
Enters a room and returns it.

`leave(roomId)`
Leaves a room.

### Room

A Room object is returned when calling `Client.enter`.

`bundle(callback)`
Merges operations in the callback function into a single operation.

`getClientId()`
Returns the id of the client.

`getOthers()`
Returns all other users in the Room.

`getRoomId()`
Returns the Room id.

`newList(id)`
Returns a new top-level SyncedList.

`newMap(id)`
Returns a new top-level SyncedMap.

`newNestedList()`
Returns a new SyncedList that can be nested within another synced type.

`newNestedMap()`
Returns a new SyncedMap that can be nested within another synced type.

`subscribe(subscribedItem, callback)`
Subscribes to updates for an item. If the `subscribedItem` is a SyncedList or SyncedMap, the provided callback is executed whenever that shared type changes. If the subscribedItem is `'others'`, the provided callback is executed whenever another client's presence changes.

`unsubscribe(subscribedItem)`
Stops subscribing to the SyncedList or SyncedMap passed as an argument.

`updatePresence(props)`
Updates the presence of the client. Properties passed as arguments will be updated, while other properties of presence will remain unchanged.

### History

`canRedo()`
Checks whether there are any operations to redo, and returns a boolean.

`canUndo()`
Checks whether there are any operations to undo, and returns a boolean.

`clear()`
Removes all operations from the history.

`mergeAll()`
Merges all subsequent operations into a single operation until `stopMergingAll` is called.

`redo()`
Redoes the last operation by the client.

`stopCaptureTimeout()`
Prevents the next operation from being merged with the previous based on `captureTimeout`.

`stopMergingAll()`
Stops merging operations; subsequent operations will be treated as separate.

`undo()`
Undoes the last operation by the client.

### SyncedList

The SyncedList is a shared type that is similar to the JavaScript Array.

`length`
Returns the number of elements of the SyncedList.

`clear()`
Removes all elements from the SyncedList.

`delete(index, length)`
Removes `length` elements from the SyncedList starting at the specified index.

`every(callback)`
Checks whether all elements in the SyncedList pass the test implemented by the provided function, and returns a Boolean value.

`filter(callback)`
Returns a new array containing all elements in the SyncedList that pass the test implemented by the provided function.

`find(callback)`
Returns the first element in the SyncedList that satisfies the provided testing function.

`forEach(callback)`
Calls the provided function once for each element of the SyncedList.

`get(index)`
Returns the element at the specified index of the SyncedList.

`indexOf(element)`
Returns the first index at which a given element can be found in the SyncedList, or -1 if not present.

`insert(index, ...elements)`
Inserts one or more elements at the specified index.

`lastIndexOf(element)`
Returns the index of the last occurrence of the specified element in the SyncedList, or -1 if not present.

`map(callback)`
Returns an array containing the elements of the SyncedList for which the provided function returns a truthy value.

`move(oldIndex, newIndex)`
Moves the element at a specified index of the SyncedList to a new index.

`newHistory(captureTimeout=0)`
Returns a new History object that can be used to undo/redo the current client's changes.

`push(...elements)`
Adds one or more elements to the SyncedList and returns the new length of the SyncedList.

`set(index, element)`
Replaces the element at the specified index of the SyncedList with the provided element.

`slice(start, end)`
Returns an array containing the elements of the SyncedList from `start` to `end` (non-inclusive).

`some(callback)`
Checks whether at least one element in the SyncedList passes the test implemented by the provided function, and returns a Boolean value.

`toArray()`
Returns an array containing all the elements of the SyncedList.

`toJSON()`
Returns a JSON representation of the SyncedList.

`unshift(...elements)`
Adds one or more elements to the beginning of the SyncedList and returns the new length of the SyncedList.

### SyncedMap

The SyncedMap is a shared type that is similar to the JavaScript Map.

`clear()`
Removes all elements from the SyncedMap.

`copy()`
Returns a new SyncedMap with the same #values as the caller.

`delete(key)`
Removes the specified entry from the SyncedMap by key. Returns true if the entry existed and has been removed, or false if it did not exist.

`entries()`
Returns a new Iterator object of [key, value] pairs for each entry in the SyncedMap.

`forEach(callback)`
Calls the provided function once for each [key, value] pair of the SyncedMap.

`get(key)`
Returns a specified entry from the SyncedMap.

`has(key)`
Returns a Boolean indicating whether the SyncedMap contains an entry with the specified key or not.

`keys()`
Returns a new Iterator object containing the keys for each entry in the SyncedMap.

`newHistory()`
Returns a new History object that can be used to undo/redo the current client's changes.

`set(key, value)`
Adds or updates an entry in the SyncedMap with a specified key and a value.

`size()`
Returns the number of elements in the SyncedMap.

`toJSON()`
Returns a JSON representation of the SyncedMap.

`values()`
Returns a new Iterator object that contains the the values for each entry in the SyncedMap.
