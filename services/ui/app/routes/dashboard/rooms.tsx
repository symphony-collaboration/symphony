import { Table } from "~/components/Table";
import type { Room } from "~/components/types";
import columns from "~/components/TableColumns";

const data: Room[] = [
  {
    roomName: "Test Room",
    lastConnectedAt: `${Date.now().toString()}`,
    storageSize: 100,
  },
];

export default function Rooms() {
  const pluralize = (count: number, noun: string, suffix = 's') =>
  `${count} ${noun}${count !== 1 ? suffix : ''}`;

  return (
    <>
      <header className="mb-8">
        <strong className="block font-medium text-gray-900 mb-5">
          Rooms
        </strong>
      </header>
      <Table columns={columns} data={data} />
      <p className="mt-1 text-sm text-gray-700">
        {pluralize(data.length, 'room', 's')}
      </p>
    </>
  );
}
