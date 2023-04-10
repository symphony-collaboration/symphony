import { useEventSource, eventStream, } from "remix-utils";
import { useEffect, useState, useMemo, useCallback } from "react";
import { SYMPHONY_API } from "~/shared/constants";
import { ColumnDef, SortingState } from "@tanstack/react-table";

import columns from "./ConnectionColumns";
import { RoomConnections } from "./types";

import {
  useReactTable,
  flexRender,
  getCoreRowModel,
} from "@tanstack/react-table";
import { pluralize } from "~/shared/utils";

interface LiveConnectionsProps {
  onRoomInspect: any,
  inspectingRoom: string,
}

const connectionEventsUrl = `${SYMPHONY_API}/events`;

export default function LiveConnections({onRoomInspect, inspectingRoom}:LiveConnectionsProps) {
  // const [sorting, setSorting] = useState<SortingState>([]);
  // const [inspectingRoom, setInspectingRoom] = useState("");
  const conns = useEventSource(connectionEventsUrl);

  const rooms = [];
  if (conns) {
    try {
      const parsedRooms = JSON.parse(conns)
      for (let room in parsedRooms) {
        const connData = {
          name: room, 
          conns: parsedRooms[room]
        }
        
        rooms.push(connData)
      }

    } catch(e) {
      console.log("something went wrong recieving sse from /api/events")
      throw e;
    }
  }

  const table = useReactTable({
    columns,
    data: rooms,
    getCoreRowModel: useCallback(getCoreRowModel(), []),
  });

  if (!rooms.length) {
    return (
    <div key="live-connections" className="">
      <header key="live-connections-header" className="mb-8">
        <strong className="block font-medium text-gray-900 mb-5">Live Connections</strong>
      </header>
      <div>No Connections</div>
    </div>
    )
  }

  return (
    <div key="live-connections" className="">
      <header key="live-connections-header" className="mb-8">
        <strong className="block font-medium text-gray-900 mb-5">Live Connections</strong>
      </header>
      <table className="min-w-full divide-y-2 divide-gray-200 text-sm">
      <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th
                  key={header.id}
                  className="whitespace-nowrap py-2 text-left font-medium text-gray-900"
                >
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                </th>
              ))}
            </tr>
            ))}
          </thead>

        <tbody className="divide-y divide-gray-200">
          {
            rooms.map(room => 
              <tr key={`${room.name}-tr`}>
                <td key={`${room.name}-td`} className="whitespace-nowrap py-2 font-medium text-gray-900">
                  {room.name}
                </td>

                <td key={`${room.conns}-td`} className="whitespace-nowrap py-2 font-medium text-gray-900">
                  {inspectingRoom === room.name ? Number(room.conns) - 1 : room.conns}
                </td>

                <td key={`${room.name}-view-state`} className="whitespace-nowrap py-2">
                  <a
                    key={`live-state-${room.name}-button`}
                    href="/LiveRoomState"
                    className="inline-block rounded bg-indigo-600 px-4 py-2 text-xs font-medium text-white hover:bg-indigo-700"
                    onClick={(e: any) => onRoomInspect(e, room.name)}
                  > 
                    {inspectingRoom === room.name ? "Disconnect" : "View" }
                  </a>
                </td>
              </tr>              
            )
          }
        </tbody>
      </table>
      <span className="text-xs text-grey-200">{pluralize(rooms.length, "room")}</span>
    </div>
  );
}