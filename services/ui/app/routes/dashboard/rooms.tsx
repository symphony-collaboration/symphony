import { Table } from "~/components/Table";
import type { Room } from "~/components/types";
import columns from "~/components/TableColumns";
import { useLoaderData } from "@remix-run/react";
import { fetch, json } from "@remix-run/node";
import { pluralize, getCurrent24HrTime } from "~/shared/utils";

export const loader = async () => {
  // uncomment this after URL has been replaced with the correct one
  // const response = await fetch("http://symphony.com/rooms")
  // const { rooms } = await response.json()
  // return rooms

  const dummyData: Room[] = [
    {
      roomName: "Test Room",
      lastConnectedAt: `${getCurrent24HrTime()}`,
      storageSize: 100,
    },
  ];

  return dummyData;
};

export default function Rooms() {
  const rooms = useLoaderData<typeof loader>();

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
