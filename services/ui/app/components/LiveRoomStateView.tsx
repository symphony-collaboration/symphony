import * as Y from "yjs";

import {useState, useEffect, useRef } from "react";
import { SYMPHONY_WS_URL } from "~/shared/constants";

import { initSyncedType } from "~/shared/utils";
import uuid from 'react-uuid';
import { WebsocketProvider } from "y-websocket";


interface LiveRoomStateViewProps {
  room: string,
  onDisconnect: any;
}

interface SyncedObject {
  type: string,
  state: any,
}

export interface SyncedObjects {
  [key: string]: SyncedObject
}

export default function LiveRoomStateView({room, onDisconnect}: LiveRoomStateViewProps) {
  const roomState = useRef<Y.Doc | null>() 
  const wsProvider = useRef<WebsocketProvider | null>();

  const [syncedObjects, setSyncedObjects] = useState<SyncedObjects>({});
  const [viewingSyncedType, setViewingSyncedType] = useState("");

  const handleViewSyncedTypeToggle = (id: string): void => {
    if (viewingSyncedType === id) {
      setViewingSyncedType(uuid().toString());
    } else {
      setViewingSyncedType(id)
    }
  }

  const handleDisconnect = (e: any) => {
    if (wsProvider.current) {
      wsProvider.current.disconnect();
      wsProvider.current = null;
    }

    if (roomState.current) {
      roomState.current = null;
    }

    onDisconnect(e, room)
  }

  const updateSyncedObjects = () => {
    if (!roomState.current) return;
    const newSyncedObjects : SyncedObjects = {};


    roomState.current.share.forEach((abstractType: any, id: string) => {
        if (!roomState.current) return;

        const { state, type } = initSyncedType(roomState.current, id);
        newSyncedObjects[id] = {state: state.toJSON(), type};
    })
    setSyncedObjects(newSyncedObjects)
  }


  useEffect(() => {
    if (!roomState.current) {
      roomState.current = new Y.Doc();
      roomState.current.on('update', (update: any) => {
        updateSyncedObjects();
      });
    }

    if (!wsProvider.current) {
      wsProvider.current = new WebsocketProvider(SYMPHONY_WS_URL, room, roomState.current);
    }


    return () => {
      if (wsProvider.current) {
        wsProvider.current.disconnect();
        wsProvider.current = null;
      }

      if (roomState.current) {
        roomState.current = null;
      }
    }
  }, [room])

  if (!room) return null;

  return (
    <div className="" key={`${room}-synced-objects`}>
    <header key="synced-objects-list-header">
      <strong className="block font-medium text-gray-900 mb-5">
        Live State: {room}
        <a 
          href="/room/hide" 
          className="hide-room-state"
          onClick={handleDisconnect}>
            Disconnect
        </a>  
      </strong>

    </header>
    <ul key="synced-objects-list" className="synced-objects-list">
          {
            Object.keys(syncedObjects).map((key: string) => {   
              let className = ""
              if (key !== viewingSyncedType) className += "inline-block";

              return <li key={`${key}-list-item`} className={className}>
                <span key={`${key}-list-span`} className="mx-2 my-2">
                  <i key={`${key}-type`} className="synced-type">{syncedObjects[key].type}</i>: 
                  "<b key={`bolded-${key}`}>{key}</b>"
                  <span key={key} onClick={() => handleViewSyncedTypeToggle(key)} className="view-arrow">
                    {viewingSyncedType === key ? "🔼" : "🔽"}
                  </span>
                  {viewingSyncedType === key 
                    ? (<><div className="m-2 bg-white text-black" key={`${key}-state-view`}>
                        {
                          syncedObjects[viewingSyncedType] 
                          ? syncedTypeView(syncedObjects[viewingSyncedType], viewingSyncedType)
                          : "" 
                        }
                      </div></>
                      ) 
                    : ""}
                </span>
              </li>
            }
            )
          }   
        </ul>
    </div>
  )
}


const syncedTypeView = ({type, state}: SyncedObject, id: string) => {
  return <pre className="room-state-json ml-2">
    {JSON.stringify(state, null, 2)}
  </pre>
}