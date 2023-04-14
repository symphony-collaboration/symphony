import { createColumnHelper } from "@tanstack/react-table";
import type { Room } from "./types";
import RoomStateView from "./RoomStateView";

const columnHelper = createColumnHelper<Room>();

const columns = (onRoomSelect: any, inspecting: string) => [
  columnHelper.accessor((row) => row.name, {
    id: "roomName",
    cell: (info) => info.getValue(),
    header: () => "Room Name",
  }),

  columnHelper.accessor((row) => 
  row.active 
  ? "Active"
  :`${new Date(row.updatedAt).toLocaleString()}`, 
  {
    id: "lastUpdate",
    cell: (info) => info.getValue() || "none",
    header: () => "Last Update",
  }),

  columnHelper.accessor((row) => row.bytes, {
    id: "storageSize",
    cell: (info) => info.getValue(),
    header: () => "Storage Size (Bytes)",
  }),
  columnHelper.display({
    id: "actions",
    cell: (props) => {
      const room = props.row.original
    
      if (room.active) {
        console.log("ACTIVE");
        return (
          <span className="whitespace-nowrap py-2">
            <a
              href="/dashboard/rooms"
              className="inline-block rounded bg-[#29ea8a] px-4 py-2 text-xs font-medium text-white opacity-60"
              onClick={e => e.preventDefault()}
            >
              Active
            </a>
          </span>
        )       
      }

      if (inspecting === room.name) {
        return (
          <div>
            <span className="py-2">
              <a
                href="/dashboard/rooms"
                className="inline-block rounded bg-[#41c9f9] px-4 py-2 text-xs font-medium text-white hover:bg-[#3e86fa]"
                onClick={e => onRoomSelect(e, room.name)}
              >
                Hide
              </a>
            </span>
          </div>
        )
      }
    

      return (
      <span className="whitespace-nowrap py-2">
        <a
          href="/dashboard/rooms"
          className="inline-block rounded bg-[#3e86fa] px-4 py-2 text-xs font-medium text-white hover:bg-[#41c9f9]"
          onClick={e => onRoomSelect(e, props.row.original.name)}
        >
          View
        </a>
      </span>
    )},
  }),
];

export default columns;
