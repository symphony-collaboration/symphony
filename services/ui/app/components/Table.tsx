import { useState } from "react";

import {
  useReactTable,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
} from "@tanstack/react-table";

import type { ColumnDef, SortingState } from "@tanstack/react-table";
import { Room } from "./types";

import RoomStateView from "./RoomStateView";

export type TableProps<Data extends object> = {
  data: Data[];
  columns: ColumnDef<Data, any>[];

};

export function Table<Data extends object>({
  data,
  columns,
}: TableProps<Data>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const table = useReactTable({
    columns,
    data,
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    state: {
      sorting,
    },
  });

  return (
    <div className="">
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
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id}>
              {row.getVisibleCells().map((cell) =>{
                const room = row.original as Room;
                
                if (room.active && cell.column.columnDef.id === 'lastUpdate') {
                  return (
                    <td key={cell.id}>

                      <svg height="100" width="100" className="blinking">
                        <circle cx="50" cy="50" r="7" fill="green" />
                        Active  
                      </svg> 
                    </td>
                  )
                }

                return (
                  <td key={cell.id} className="whitespace-nowrap py-2 font-medium text-gray-900">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                )
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
