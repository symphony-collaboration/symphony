# Overview

Symphony is an open source framework designed to make it easy for developers to build collaborative web applications. Symphony handles the complexities of implementing collaboration, including conflict resolution and real-time infrastructure, freeing developers to focus on creating unique and engaging features for their applications.

To learn more about Symphony, read the [case study](#case-study)

# Infrastructure

Symphony's infrastructure is built using the [Terraform Cloud Development Kit](https://developer.hashicorp.com/terraform/cdktf) (CDKTF)

The core components of the Symphony infrastructure are described below:

<TODO: Add image of Symphony infrasrtucture>

# Resources Created
---

## VPC

A single default Virtual Private Cloud (VPC)

## Kubernetes Cluster

A Kubernetes cluster deployed on Google Kubernetes Engine (GKE), running on Autopilot mode.

The following services are deployed on the K8s cluster in their respective namespaces:

### Symphony Proxy (server namespace)

A websocket proxy that orchestrates room creation and proxies client websocket requests to the correct room service.

### Symphony WebSocket Server (rooms namespace)

A websocket server (room), which collaborating clients connect to. Each room holds the state of a single document in memory.

### Symphony Developer Dashboard (dashboard namespace)

A developer dashboard UI that provides metrics, allowing developers to easily monitor the state of the system.

### Monitoring Services (monitoring namespace)

Services which are used to ingest and visualise metrics from the Prometheus cluster.

- Prometheus UI
- Grafana

### Other

- Kubernetes Database initialization job- a K8s Job, which initializes the database schema.
- Balloon pods- pods to provision spare capacity to enable faster auto-scaling and room bootup
---
### Security

The K8s cluster has been deployed with suitable role-based access control (RBAC) permissions in line with the principle of least privilege.

## Cloud SQL Instance

A Postgres (v14) database hosted on Google Cloud SQL storing all room metadata.

## Cloud Storage Bucket

A Google Cloud Storage bucket that is used to persist room state.

## Prometheus Cluster

A monitoring service that is used to scrape and aggregate metrics from active rooms.


