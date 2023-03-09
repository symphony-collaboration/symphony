import InfoCard from "~/components/InfoCard";
import Divider from "~/components/Divider";
import type { InfoCardInterface, GraphCardInterface } from "~/components/types";
import GraphCard from "~/components/GraphCard";

const Dashboard = () => {
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
      data: "1",
    },
    {
      id: 2,
      metricName: "Connections",
      data: "2",
    },
    {
      id: 3,
      metricName: "Active Rooms",
      data: "3",
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
