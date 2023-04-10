import { useState } from "react";

import LiveRoomStateView from "./LiveRoomStateView";
import LiveConnections from "./LiveConnections";

const LiveView = () => {
  const [inspectingRoom, setInspectingRoom] = useState("");

  const handleShowLiveState = (e: any, room: string) => {
    e.preventDefault();
    if (!room) return;

    if (inspectingRoom === room) return setInspectingRoom("")
    setInspectingRoom(room);
  }
  
  const handleLiveStateDisconnect = (e: any) => {
    e.preventDefault();
    setInspectingRoom("")
  }
  

  return (
    <> 
      {
        inspectingRoom 
        ? (
          <LiveRoomStateView 
            onDisconnect={handleLiveStateDisconnect} 
            room={inspectingRoom}
          />
          )
        : null
      }
      <LiveConnections inspectingRoom={inspectingRoom} onRoomInspect={handleShowLiveState}/>
    </>
  )
}

export default LiveView;