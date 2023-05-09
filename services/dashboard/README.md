<TODO: Add Symphony Logo>

# Symphony Developer Dashboard
---

## Overview

The Symphony dashboard provides developer’s with a centralised interface to observe their real-time applications built using Symphony. It allows developers to easily monitor the health, usage and history of their applications in real-time by exposing pertinent system-level and application-level metrics.

These metrics include:

- Number of active connections i.e. collaborating users per room
- Size of room state (bytes) per room
- Number of active rooms
- Total number of rooms created (inactive + active rooms)
- CPU/Memory usage per room

and more…

The dashboard provides both pre-configured dashboards and allows for the creation of custom dashboards via [Grafana](https://grafana.com) by developers to visualise these metrics.

## Usage

You can access the dashboard by running the `symphony dashboard` command in your terminal.

Note that you must first create a Symphony project and deployment by completing the steps mentioned [here]()

## Implementation

<TODO: Add image where other parts of infra are blurred and only dashboard is shown>

The Symphony dashboard is built using [Remix](https://remix.run)/[React](https://react.dev), [Express](https://expressjs.com), [Tailwind CSS](https://tailwindcss.com), and [TypeScript](https://www.typescriptlang.org).

The UI provides a visualisation of room metrics that are scraped and aggregated by [Prometheus](https://prometheus.io) in real-time as a collection of pre-configured [Grafana](https://grafana.com) dashboards.

The Symphony dashboard also exposes historical metadata about each room by querying the Cloud SQL Postgres database via the [Prisma]() ORM.

