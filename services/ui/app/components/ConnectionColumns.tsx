import { createColumnHelper } from "@tanstack/react-table";
import type { RoomConnections } from "./types";



const columnHelper = createColumnHelper<RoomConnections>();

const columns = [
  columnHelper.accessor((row) => row.name, {
    id: "roomName",
    cell: (info) => info.getValue(),
    header: () => "Room",
  }),

  columnHelper.accessor((row) => row.conns, {
    id: "conns",
    cell: (info) => info.getValue(),
    header: () => "Current Connections",
  }),

  columnHelper.display({
    id: "actions",
    cell: (props) => (
      <td className="whitespace-nowrap py-2">
        <a
          href="#"
          className="inline-block rounded bg-indigo-600 px-4 py-2 text-xs font-medium text-white hover:bg-indigo-700"
        >
          State
        </a>
      </td>
    ),
  }),
];

export default columns;
