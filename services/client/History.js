import * as Y from 'yjs';

export class DeleteSet {
  constructor () {
    /**
     * @type {Map<number,Array<DeleteItem>>}
     */
    this.clients = new Map();
  }
}

const sortAndMergeDeleteSet = ds => {
  ds.clients.forEach(dels => {
    let i, j
    for (i = 1, j = 1; i < dels.length; i++) {
      const left = dels[j - 1]
      const right = dels[i]
      if (left.clock + left.len >= right.clock) {
        left.len = Math.max(left.len, right.clock + right.len - left.clock)
      } else {
        if (j < i) {
          dels[j] = right
        }
        j++
      }
    }
    dels.length = j
  })
}

const mergeDeleteSets = dss => {
  const merged = new DeleteSet()
  for (let dssI = 0; dssI < dss.length; dssI++) {
    dss[dssI].clients.forEach((delsLeft, client) => {
      if (!merged.clients.has(client)) {
        let dels = delsLeft.slice()
        for (let i = dssI + 1; i < dss.length; i++) {
          dels = dels.concat(dss[i].clients.get(client) || [])
        }
        merged.clients.set(client, dels)
      }
    })
  }
  sortAndMergeDeleteSet(merged)
  return merged
}

/**
 * @classdesc The SyncedList is a shared type that is similar to the JavaScript Array.
 * @hideconstructor
 */

class History {
  #undoManager;
  #pausedIndex;

  // Optionally, you may specify trackedOrigins to filter specific changes. By default, all local changes will be tracked. 
  constructor(syncedType, captureTimeout=0) {
    this.#undoManager = new Y.UndoManager(syncedType, {captureTimeout});
    this.#pausedIndex = null;
  }

  undo() {
    if (this.#pausedIndex != null && this.#pausedIndex < this.#undoManager.undoStack.length) {
      const stack = this.#undoManager.undoStack;
      const deletionsToMerge = stack.slice(this.#pausedIndex).map(op => op.deletions);
      const insertionsToMerge = stack.slice(this.#pausedIndex).map(op => op.insertions);
      const lastOp = stack[stack.length - 1];
      lastOp.deletions = mergeDeleteSets(deletionsToMerge);
      lastOp.insertions = mergeDeleteSets(insertionsToMerge);
      // remove ops to be merged from stack
      stack.splice(this.#pausedIndex, this.#undoManager.undoStack.length - this.#pausedIndex);
      // add merged ops to stack
      stack.push(lastOp);
      this.#pausedIndex = null;
    }
    this.#undoManager.undo();
  }

  redo() {
    this.#undoManager.redo();
  }

  canUndo() {
    return this.#undoManager.undoStack.length > 0;
  }

  canRedo() {
    return this.#undoManager.redoStack.length > 0;
  }

  // https://discuss.yjs.dev/t/captureall-method-for-undomanager/959

  mergeAll() {
    this.#pausedIndex = this.#undoManager.undoStack.length;
  }

  stopMergingAll() {
    this.#pausedIndex = null;
  }

  stopCaptureTimeout() {
    this.#undoManager.stopCapturing();
  }

  clear() {
    this.#undoManager.clear();
  }

//   undoManager.on('stack-item-added', {stackItem: { meta: Map<any,any>, type: 'undo'|'redo'}}
//     Register an event that is called when a StackItem is added to the undo- or the redo-stack.
//   undoManager.on('stack-item-popped', { stackItem: { meta: Map<any,any> }, type: 'undo' | 'redo' })
//     Register an event that is called when a StackItem is popped from the undo- or the redo-stack.
}

export default History;