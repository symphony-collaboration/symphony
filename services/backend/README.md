### Scalable-backend adapted from y-websocket module

Built on y-websocket, with multiple changes to make it scalable.

Original y-websocket module held every document state in memory on a single server, with no persitence.

Added long-term persistence
  -  AWS S3: storage of encoded document state between sessions. Encoded document state stored after a collaborative session ends.

Added metadata persistence for developer analysis
  - RDS: storage of room metadata
  - denormalized a table for storing time-based data
    - we opted for simplicity as opposed to including an extra database just to store `connections`

Most existing scalable implementaitons of `y-websocket` use 2 methods
  - sharding: placing document state on specific servers, users of same document routed to same server(s)
  - pub/sub: use an internal pub/sub mechanism that receives updates from ws servers and coordinates the message propagation to the appropriate servers

There are several ways to implement scalability with pub/sub
Most implementations use redis, which integrates easily with websockets. 
The biggest differences lies in handling the distribution of document state during a collaboration session as users join at different intervals.

There are a few approaches to this issue:
- store each document in memory on every server.
- store every update in a different storage mechanism, such as a persistent queue
- retrieve state from the servers with the document already in memory


We took the 3rd approach, which like approach #2 required a different storage mechanism for retrieving and updating the location of documents in the network.
The storage mechanism will hold significantly less data than approach #2. It only needs a key, `documentID`, and a string set holding the ip addresses of
the servers that hold the document in memory.

Additionally, approach number 2 requires constantly updating the storage mechanism that holds the up-to-date document state. 
With our approach, the server will update the ip addresses only when a document is loaded into memory or when it is removed.

For the pub/sub mechanism we used a Redis cluster on AWS Elasticache. Elasticaches handles maintanence, high availability, and failover for Redis nodes.
DynamoDB is used to store the `documentID` mappings to a collection of ip addresses. It is inexpensive, provides low latency, and integrates
easily with AWS infrastructure.

The decision to use DynamoDB along with the redis cluster came down to a few reasons:
- Decoupling concerns
  - store the session data away from the redis cluster
- Redis Performance
  - using redis to store more permanent data (ip addresess) is viable, and Redis will hold the data in memory.
    In the event of a node failure, the data is lost, which is undesired. A workaround is to configure redis to
    write the data to disk for durability and recovery. Redis provides 2 mechanism for this (RDB snapshotting or AOF append-only file).
    
    Ensuring the integrity of data however, will come at a performance cost, and the whole idea is to keep persistence away from 
    the redis cluster. It should only be concerned with delivering messages, not holding data in memory.

    Additionally, using an Elasticache Redis Cluster for pub/sub messaging only allows it to be used in non-cluster mode.
    It can only have up to 6 nodes. (single or multi-leader replication)
