import { Table } from "~/components/Table";
import type { Room } from "~/components/types";
import columns from "~/components/TableColumns";
import { pluralize } from "~/shared/utils";
import axios from "axios";

import { SYMPHONY_API } from "~/shared/constants";
import { useState, useEffect } from "react";
import RoomStateView from "~/components/RoomStateView";


export default function Rooms() {
  const [lastUpdate, setLastUpdate] = useState<Date>()
  const [roomInspect, setRoomInspect] = useState("")
  const [rooms, setRooms] = useState([]);
  
  const fetchRooms = async () => {
    const response = await axios.get(`${SYMPHONY_API}/rooms`);
   
    const rooms = response.data
    setRooms(rooms);
    setLastUpdate(new Date());
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  const handleRoomSelect = (e: MouseEvent, room: string) => {
    e.preventDefault();

    if (!room) return;

    if (room === roomInspect) return setRoomInspect("")
    setRoomInspect(room)
  } 

  const handleRefresh = () => {
    fetchRooms();
  }

  return (
    <>
      <header className="mb-8">
        <strong className="block font-medium text-gray-900 mb-5">
          Rooms
          <img 
            src="/images/reload-icon.png" alt="reload icon" 
            height="40px" width="40px" className="reload-icon" 
            onClick={handleRefresh}  
          />
          <span className="text-xs text-gray-500">
            Last Updated: {lastUpdate ? lastUpdate.toLocaleTimeString() : "Unable to retrieve metrics"}
          </span>      
        </strong>
      </header>
      
      <RoomStateView room={roomInspect} onRoomInspect={handleRoomSelect}/>

      <Table 
        columns={columns(handleRoomSelect, roomInspect)} data={rooms}
      />

      <p className="mt-1 text-sm text-gray-700">
        {pluralize(rooms.length, "room", "s")}
      </p>
    </>
  );
}
