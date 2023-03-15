import InfoCard from "~/components/InfoCard";
import Divider from "~/components/Divider";
import type { InfoCardInterface, GraphCardInterface } from "~/components/types";
import GraphCard from "~/components/GraphCard";
import type { LoaderFunction } from "@remix-run/node";
import { useLoaderData } from "react-router";
import { fetch } from "@remix-run/node";

interface Connection {
  timestamp: string
  metadata: any
  _id: string
}

export const loader: LoaderFunction = async () => {
  const response = await fetch(`${process.env.SERVER_URL}/connections/since_yesterday/${(new Date()).getHours()}`);
  const data = await response.json();

  return data;
};

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

  const metrics: GraphCardInterface[] = [
    {
      id: 1,
      metricName: "Daily Active Users",
      data: Array(7).fill(latestConnections.length),
    },
    {
      id: 2,
      metricName: "Connections",
      data: [1, 2, 3, 4],
    },
    {
      id: 3,
      metricName: "Active Rooms",
      data: [9, 5, 7, 3, 5, 1],
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
        {metrics.map((metric) => {
          return (
            <GraphCard
              key={metric.id}
              metricName={metric.metricName}
              data={metric.data}
            />
          );
        })}
      </div>
    </>
  );
};

export default Dashboard;
