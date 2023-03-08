import InfoCard from "~/components/InfoCard";
import Container from "~/components/Container";
import Divider from "~/components/Divider";
import type { InfoCardInterface } from "~/components/types";

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

  return (
    <div className="w-full">
      <Container>
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
        <strong className="block font-medium text-gray-900 mb-5">
          Overview
        </strong>
      </Container>
    </div>
  );
};

export default Dashboard;
