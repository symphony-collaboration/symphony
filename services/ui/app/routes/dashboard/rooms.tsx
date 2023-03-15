import { Table } from "~/components/Table";
import type { Room } from "~/components/types";
import columns from "~/components/TableColumns";
import { useLoaderData } from "@remix-run/react";
import { fetch } from "@remix-run/node";
import { pluralize } from "~/shared/utils";

export const loader = async () => {
  const response = await fetch(`${process.env.SERVER_URL}/rooms`);
  const rooms = await response.json();

  rooms.forEach((room: Room) => (room.name = room.name.split("/").at(-1)!)); // remove after room names fixed in database

  return rooms;
};

export default function Rooms() {
  const rooms = useLoaderData<Room[]>();

  return (
    <>
      <header className="mb-8">
        <strong className="block font-medium text-gray-900 mb-5">Rooms</strong>
      </header>
      <Table columns={columns} data={rooms} />
      <p className="mt-1 text-sm text-gray-700">
        {pluralize(rooms.length, "room", "s")}
      </p>
    </>
  );
}
