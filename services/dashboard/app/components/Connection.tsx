import { useState, useEffect } from "react";
import messageQueue from "~/utils/pubsub";

export async function loader() {
  messageQueue.listen(
    process.env.G_PUB_SUB_CONNECTIONS_SUBSCRIPTION_NAME!,
    (message: any) => {
      console.log("Connection message received");
      const { roomId, connectionCount } = JSON.parse(message.data.toString());
      // setRoomConnections((roomConnections) => ({
      //   ...roomConnections,
      //   [roomId]: connectionCount,
      // }));
      message.ack();
    }
  );
}

export default function Connection() {
  const [roomConnections, setRoomConnections] = useState<
    Record<string, number>
  >({ "test-1": 3 });
  const [count, setCount] = useState(0);

  // const incomingConnectionMessage = (message: any) => {
  //   console.log("Connection message received");

  //   const { roomId, connectionCount } = JSON.parse(message.data.toString());

  //   setRoomConnections({ ...roomConnections, [roomId]: connectionCount });
  // };

  // const handleClick = (event: any) => {
  //   setCount(count + 1);

  //   const data = {
  //     data: Buffer.from(
  //       JSON.stringify({ roomId: "test-1", connectionCount: 4 })
  //     ),
  //   };

  //   incomingConnectionMessage(data);
  // };

  const handleClick = () => {};

  return (
    <div>
      <p>Connections per room</p>
      <p>Count is {count}</p>
      <ul>
        {Object.entries(roomConnections).map(([roomId, connectionCount]) => (
          <li key={roomId}>{`Room Id (${roomId}): ${connectionCount}`}</li>
        ))}
      </ul>
      <button onClick={handleClick}>Click me!</button>
    </div>
  );
}
