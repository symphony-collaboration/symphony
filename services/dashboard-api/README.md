### Symphony Dashboard Backend

Provides an API that can be queried by our UI frontend to broadcast updates.

Has access to the metadata storage for responding to API requests.

Supports SSE, allowing developer to view real-time metadata from 
the pub-sub backend servers.

To ensure updates from the pub-sub servers are not sent to the dashboard server if there are clients connected to the dashboard, I used event-driven design. 

By default, the pub-sub servers do not make send updates for connections
to the dashboard.

When the clients connected to the dashboard /api/events route goes
from 0 to 1, it triggers a broadcast of requests to all running instances of the pub-sub backend.

The broadcast serves 2 purposes:
 - instruct the pub-sub servers to start sending requests to the dashboard api on every connection open or close
 - retrieve the number of current connections to each document in memory

The response is a collection of current connections for each document, givinng an up to date reading of all current connections.

When the connected clients count falls back to 0, the dashboard server repeats the reverse process. It sends a request to all running pub-sub
servers that deactivates the connection update requests.


On startup, the pub-sub servers make an api request to the 
dashboard service to determine if it is active or not. This prevents an edge case where servers are scaled in after the dashboard server sent
the activation request.

Connections are the only metadata provided, but you could potentially provide more detailed metadata, like real-time
state for a given room, log each update for a room, etc.

For example, viewing real-time state:
 - subscribe to the redis channel of a given doc
 - find locations of the doc by querying DynamoDB
 - query any of the server ips received to retrieve the current state of a doc
 - merge the returned encoded state with a new local Ydoc 
 - as updates come in from redis channel, unencode, turn to JSON.
  - likely this last step would be more efficient if done client-side using yjs,

An easier implementation would be to simply modify the server /api/room route. Currently it uses the list of docs in memory to only return connections size, but it could easily return the whole document state
in memory. Although it wouldn't be real-time as an event is only published the the dashboard api from the pub-sub server when a
connection opens or closes. 

Modifying the pub-sub backend to not only send updates for connections, but all updates for every document could also be easily achieved by adding
another property on the `dashboard` object stored in memory on every pub-sub server instance. The property could be used to conditionally to send a request to the dashboard on document updates. 

Alternatively, you could use redis to subscribe to every channel for
documents available, then repeat the earlier process described.
