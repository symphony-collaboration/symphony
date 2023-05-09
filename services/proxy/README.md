<TODO: Add Symphony Logo>

# Symphony Proxy
---

## Overview

The Symphony proxy is a service that orchestrates room creation and acts as a reverse proxy that facilitates the connection between a client and a particular active room.

<TODO: maybe add image with proxy highlighted and rest blurred out>

## Implementation

The Symphony proxy is written in [TypeScript](https://www.typescriptlang.org).

When a client sends a request to connect to a room with a particular id, the proxy queries [etcd](https://kubernetes.io/docs/concepts/overview/components/#etcd) to see if a room with that id is active. If no such room is active, the proxy issues a request to the Kubernetes API server to create a new room with that id.

Once the room is ready to accept requests, as signalled by the associated Kubernetes readiness probe, the client connection is proxied to room. If a requested room is already active, proxying can begin immediately since no new room needs to be provisioned.

