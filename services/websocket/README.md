# Symphony Room
---

## Overview

The Symphony room server represents a collaborative room. Clients that want to collaborate on a particular document connect to the corresponding Symphony room server via WebSocket. The room server holds the state of the document in memory, applies updates received from a given client to the room state, and propagates these updates to all other collaborating clients.

The room server is configured to persist metadata to a Postgres database.

checkpointing

The room server also exports metrics in [Prometheus](https://prometheus.io/docs/instrumenting/writing_exporters/) format, which can be pulled by a valid monitoring service


## Implementation

The Symphony room server is written in JavaScript.

When a client first connects to a given room server over WebSocket via the Symphony Proxy, the room server checks if the room has any data from a previous collaborative session by querying the Cloud SQL Postgres database.


if the required document is persisted in Cloud Storage from a previous session. If it is, the document is retrieved and stored in memory; otherwise a new document is initialised in memory.




