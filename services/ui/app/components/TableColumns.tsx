import { createColumnHelper } from "@tanstack/react-table";
import type { Room } from "./types";

const columnHelper = createColumnHelper<Room>();

const columns = [
  columnHelper.accessor((row) => row.roomName, {
    id: "roomName",
    cell: (info) => info.getValue(),
    header: () => "Room Name",
  }),

  columnHelper.accessor((row) => row.lastConnectedAt, {
    id: "lastConnectedAt",
    cell: (info) => info.getValue(),
    header: () => "Last Connected At",
  }),

  columnHelper.accessor((row) => row.storageSize, {
    id: "storageSize",
    cell: (info) => info.getValue(),
    header: () => "Storage Size",
  }),

  columnHelper.display({
    id: "actions",
    cell: (props) => (
      <td className="whitespace-nowrap py-2">
        <a
          href="#"
          className="inline-block rounded bg-indigo-600 px-4 py-2 text-xs font-medium text-white hover:bg-indigo-700"
        >
          View
        </a>
      </td>
    ),
  }),
];

export default columns;
