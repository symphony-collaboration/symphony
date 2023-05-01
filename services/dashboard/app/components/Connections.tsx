import { useState } from "react";
import type { RoomId } from "./types";
import messageQueue from "~/utils/pubsub";

export default function Connections() {
  const [roomConnections, setRoomConnections] = useState<
    Record<RoomId, number>
  >({});
  const [counter, setCounter] = useState(0)

  const incomingConnectionMessage = (message: any) => {
    console.log('Connection message received');

    const parsedData = JSON.parse(message.data.toString())
    console.log('Room Id: ', parsedData.roomId)
    console.log('Connection count: ', parsedData.connections);

    setRoomConnections({ ...roomConnections, [parsedData.roomId]: parsedData.connections })
  };

  const handleClick = (event: any) => {
    console.log('clicked');

    const data = Buffer.from(
      JSON.stringify({ data: { roomId: "test-1", connections: 3 } })
    );
    incomingConnectionMessage(data);
  };

  messageQueue.listen(
    process.env.G_PUB_SUB_CONNECTIONS_SUBSCRIPTION_NAME!,
    (message) => {
      console.log("Connection message received");

      console.log("Hello:", message.data.toString());

      const parsedData = JSON.parse(message.data.toString());

      console.log("tye", parsedData.roomId, parsedData.connectionCount);

      const { roomId, connectionCount } = JSON.parse(message.data.toString());

      // setRoomConnections({ ...roomConnections, [roomId]: connectionCount });

      console.log("Current:", roomConnections);

      message.ack();
    }
  );

  return (
    <div className="outine outline-red">
      <p>Connections per Room</p>
      <ul>
        {Object.entries(roomConnections).map(([roomId, connectionCount]) => (
          <li key={roomId}>{`Room Id (${roomId}): ${connectionCount}`}</li>
        ))}
      </ul>
      <p>Count is {counter}</p>
      <button onClick={(event) => setCounter(counter+1)}>Click</button>
    </div>
  );
}
