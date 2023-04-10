import * as Y from "yjs";
import { MS_IN_DAY, TIME_BLOCK } from "./constants";

import type { Connection, SeenRoom } from "~/components/types";

export const getCurrent24HrTime = (): string => {
  const now = new Date();
  const hours = now.getHours().toString().padStart(2, "0");
  const minutes = now.getMinutes().toString().padStart(2, "0");
  const time = `${hours}:${minutes}`;
  return time;
};

export const pluralize = (count: number, noun: string, suffix = 's') => {
  return `${count} ${noun}${count !== 1 ? suffix : ''}`;
}

export const getTimeLabels = (): string[] => {
  const timeBlockLabels : string[] = [];

  const now = new Date();
  let start = new Date(now.getTime() - (MS_IN_DAY));

  while (start <= now) {
    const timeStr = start.toLocaleTimeString();
    timeBlockLabels.push(timeStr);
    start = new Date(start.getTime() + TIME_BLOCK);
  }

  return timeBlockLabels;
}

export const processConnectionMetrics = (connections: any[]) => {
  connections as Connection[];

  if (!connections.length) return [];

  let today = new Date();

  let currentBlock = today.getTime() - MS_IN_DAY;
  let nextBlock = new Date(currentBlock + TIME_BLOCK);

  const formattedMetrics = [0];

  let idx = 0;
  const lastConn = connections.length;

  while (nextBlock <= today) {
    
    let connsCount = 0;
    while (idx < lastConn && connections[idx].timestamp < nextBlock) {
      connsCount++
      idx++
    }

    currentBlock = nextBlock.getTime();
    nextBlock = new Date(currentBlock + TIME_BLOCK);

    formattedMetrics.push(connsCount);
  }

  return formattedMetrics
}

export const processRoomMetrics = (connections: any[]) => {
  connections as Connection[];

  if (!connections.length) return [];
  
  let today = new Date();

  let currentBlock = today.getTime() - MS_IN_DAY;
  let nextBlock = new Date(currentBlock + TIME_BLOCK);

  const formattedMetrics = [0];

  let idx = 0;
  const lastConn = connections.length;

  while (nextBlock <= today) {
    
    let uniqueRooms = 0;
    const seenRooms : SeenRoom = {};
    
    while (idx < lastConn && connections[idx].timestamp < nextBlock) {
      const conn = connections[idx] as Connection;

      const roomName = conn.roomName
      uniqueRooms += (seenRooms[roomName] ? 0 : 1)
      seenRooms[roomName] = true;
      idx++
    }

    currentBlock = nextBlock.getTime();
    nextBlock = new Date(currentBlock + TIME_BLOCK);

    formattedMetrics.push(uniqueRooms);
  }

  return formattedMetrics
}

export const formatRawConnections = (connections: any[]) => {
  connections as Connection[];

  connections.forEach((conn: Connection) => conn.timestamp = new Date(conn.timestamp))
}

export const SyncedTypes: {[key: string]: string} = {
  'YText': 'SyncedText',
  'YArray': 'SyncedArray',
  'YMap': 'SyncedMap'
}

export const initSyncedType = (doc: Y.Doc, id: string): any => {
    try {
      return {
        state: doc.getMap(id),
        type: SyncedTypes[Y.Map.name],
      }
    } catch {
    }

    try {
      return {
        state: doc.getArray(id),
        type: SyncedTypes[Y.Array.name],
      }    } catch {
    }

    try {
      return {
        state: doc.getText(id),
        type: SyncedTypes[Y.Text.name],
      }    
    } catch {
    }

    console.log("unsupported syncedType");
    return {
      type: "unsupported",
      state: {}
    };
}
