import { Table } from "~/components/Table";
import type { Room } from "~/components/types";
import columns from "~/components/TableColumns";
import { fetch } from "@remix-run/node";
import { pluralize } from "~/shared/utils";

import { useLoaderData } from "@remix-run/react";

import LiveConnections from "~/components/LiveConnections";

import { SYMPHONY_API } from "~/shared/constants";
import { useEventSource, eventStream, } from "remix-utils";
import { useEffect } from "react";

import LiveView from "~/components/LiveView";

export default function LiveRooms() {
  return (
    <LiveView />
  );
}