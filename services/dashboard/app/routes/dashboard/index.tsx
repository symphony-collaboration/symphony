import InfoCard from "~/components/InfoCard";
import Divider from "~/components/Divider";
import type { InfoCardInterface, GraphCardInterface } from "~/components/types";
import GraphCard from "~/components/GraphCard";
import type { LoaderFunction } from "@remix-run/node";
import { useLoaderData } from "react-router";
import { fetch } from "@remix-run/node";
import { getActiveRooms, getAllRooms } from "~/utils/rooms";
import MetricCard from "~/components/MetricCard";

interface Connection {
  timestamp: string;
  metadata: any;
  _id: string;
}

export const loader: LoaderFunction = async () => {
  const totalRooms = await getAllRooms();
  const activeRooms = await getActiveRooms();

  return {
    totalRooms: totalRooms.length,
    activeRooms: activeRooms.length,
  };
};

const Dashboard = () => {
  const data = useLoaderData() as any;

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

  const valueMetrics = [
    {
      id: 1,
      metricName: "Total Rooms",
      value: data.totalRooms,
    },
    {
      id: 2,
      metricName: "Total Active Connections",
      value: 5,
    },
    {
      id: 3,
      metricName: "Active Rooms",
      value: data.activeRooms,
    },
  ];

  return (
    <>
      <header className="mb-8">
        <strong className="block font-medium text-gray-900 mb-5">
          {" "}
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
      <strong className="block font-medium text-gray-900 mb-5">Overview</strong>
      <div className="flex justify-between gap-10 mb-10">
        {valueMetrics.map((metric) => {
          return (
            <MetricCard
              key={metric.id}
              metricName={metric.metricName}
              value={metric.value}
            />
          );
        })}
      </div>
    </>
  );
};

export default Dashboard;
