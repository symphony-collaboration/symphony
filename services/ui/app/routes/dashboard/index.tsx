import InfoCard from "~/components/InfoCard";
import Divider from "~/components/Divider";
import { SYMPHONY_WS_URL } from "~/shared/constants";

import type { InfoCardInterface, GraphCardInterface, Connection } from "~/components/types";
import { SYMPHONY_API } from "~/shared/constants";
import { formatRawConnections, getCurrent24HrTime, processConnectionMetrics, processRoomMetrics } from "~/shared/utils";
import { useEffect, useState } from "react";

import DailyOverviewMetrics from "~/components/DailyOverview";

const Dashboard = () => {
  const latestConnections = useLoaderData() as Awaited<Connection[]>


  const infoCards: InfoCardInterface[] = [
    {
      id: 1,
      title: "Concepts",
      description: "Learn the concepts of Symphony before getting started",
      link: { text: "Learn concepts", href: "#" },
    },
    {
      id: 2,
      title: "Get Started",
      description:
        "Learn how to auto-deploy and self-host Symphony using our CLI tool",
      link: { text: "Get Started", href: "#" },
    },
    {
      id: 3,
      title: "Examples",
      description:
        "Browse and take inspiration from our galley of collaborative UI patterns",
      link: { text: "Browse Examples", href: "#" },
    },
  ];

  const [lastUpdate, setLastUpdate] = useState<Date>();
  const [connections, setConnections] = useState<Connection[]>([]);

  const fetchDailyOverviewMetrics = async() => {
    const hour = getCurrent24HrTime().split(":")[0];
    const apiUrl = `${SYMPHONY_API}/connections/since_yesterday/${hour}`;

    try {
      const res = await fetch(apiUrl);  
      const connections = await res.json();
    
      formatRawConnections(connections);
      setConnections(connections);
      setLastUpdate(new Date())
    } catch {
      
    }
  }
  
  const handleRefresh = () => {
    fetchDailyOverviewMetrics();
  }

  useEffect(() => {
    fetchDailyOverviewMetrics();
  }, [])

  const metrics: GraphCardInterface[] = [
    {
      id: 2,
      metricName: "Active Connections",
      metricData: processConnectionMetrics(connections),
    },
    {
      id: 3,
      metricName: "Active Rooms",
      metricData: processRoomMetrics(connections),
    },
  ];

  
  return (
    <>
      <header className="mb-8">
        <strong className="block font-medium text-gray-900 mb-5">
          Welcome to Symphony{" "}
        </strong>
        <p className="mt-1 text-sm text-gray-700">
          Follow the steps below or browse our developer documentation to get
          started.
        </p>
      </header>
      <div className="flex justify-between gap-10 mb-10">
        {infoCards.map((card) => {
          return (
            <InfoCard
              key={card.id}
              title={card.title}
              description={card.description}
              link={card.link}
            />
          );
        })}
      </div>
      <Divider />
        <strong className="block font-medium text-gray-900 mb-5">
          Last 24 hours
          <img 
            src="/images/reload-icon.png" alt="reload icon" 
            height="40px" width="40px" className="reload-icon" 
            onClick={handleRefresh}  
          />
          <span className="text-xs text-gray-500">
            Last Updated: {lastUpdate ? lastUpdate.toLocaleTimeString() : "Unable to retrieve metrics"}
          </span>
        </strong>
        <span className="text-sm text-gray-500 mb-2">
          Websocket Servers Endpoint: <b className="mx-2">{SYMPHONY_WS_URL}</b>
        </span>
        <DailyOverviewMetrics metrics={metrics} />
    </>
  );
};

export default Dashboard;
