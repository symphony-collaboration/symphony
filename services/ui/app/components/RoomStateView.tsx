import * as Y from "yjs";

import {useState, useEffect, useRef } from "react";
import { SYMPHONY_API } from "~/shared/constants";
import axios from "axios";

import uuid from 'react-uuid';

import { initSyncedType } from "~/shared/utils";

interface RoomStateViewProps {
  room: string,
  onRoomInspect: any;
}

interface SyncedObject {
  type: string,
  state: any,
}

export interface SyncedObjects {
  [key: string]: SyncedObject
}


const roomStateApi = `${SYMPHONY_API}/rooms`;

export default function RoomStateView({room, onRoomInspect}: RoomStateViewProps) {
  const [syncedObjects, setSyncedObjects] = useState<SyncedObjects>({});
  const [viewingSyncedType, setViewingSyncedType] = useState("");
  
  const handleViewSyncedTypeToggle = (id: string): void => {
    if (viewingSyncedType === id) {
      setViewingSyncedType(uuid().toString());
    } else {
      setViewingSyncedType(id)
    }
  }

  useEffect(() => {
    if (!room) return;

    const fetchData = async() => {
      try {
        const res = await axios.get(`${roomStateApi}/${room}`, {
          responseType: 'arraybuffer',
        });

        const { data } = res;

        const uInt8Update = new Uint8Array(data);
        const doc = new Y.Doc();

        Y.applyUpdate(doc, uInt8Update);

        const syncedObjs : SyncedObjects = {};

        doc.share.forEach((abstractType: any , id: any) => {          
          const {state, type} = initSyncedType(doc, id)
          syncedObjs[id] = {state: state.toJSON(), type};
        })

        setSyncedObjects(syncedObjs);
        return;

      } catch(error) {
        if (axios.isCancel(error)) {
          return;
        } else {
          console.log("error fetching data", {error})
        }
      }
    }

    setSyncedObjects({});
    fetchData();
  }, [room]);
  
  if (!room) return null;

  return (
    <>
      <div className="mb-5" key={`${room}-synced-objects`}>
        <header key="synced-objects-list-header">
          Synced Objects for Room: <b>{room}</b>
          <a 
            href="/room/hide" 
            className="hide-room-state"
            onClick={(e: any) => onRoomInspect(e, room)}>
              Hide
          </a>
        </header>
        <ul key="synced-objects-list" className="synced-objects-list">
          {
            Object.keys(syncedObjects).map((key: string, idx: number, keys) => {   
              let className = ""
              if (key !== viewingSyncedType) className += "inline-block";

              return <li key={`${key}-list-item`} className={className}>
                <span key={`${key}-list-span`} className="mx-2 my-2">
                  <i key={`${key}-type`}>{syncedObjects[key].type}</i>: "<b key={`bolded-${key}`}>{key}</b>"
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
    </>
  )
}


const syncedTypeView = ({type, state}: SyncedObject, id: string) => {
  return <pre className="room-state-json ml-2">
    {JSON.stringify(state, null, 2)}
  </pre>
}
