import GraphCard from "~/components/GraphCard";import type { GraphCardInterface } from "~/components/types";

interface DashboardOverviewMetricsProps {
  metrics: GraphCardInterface[];
}

const DailyOverviewMetrics = ({metrics}: DashboardOverviewMetricsProps) => {
  return (
    <div className="flex justify-between gap-10 mb-10">
      {metrics.map((metric) => {
        return (
          <GraphCard
            key={metric.id}
            metricName={metric.metricName}
            metricData={metric.metricData}
          />
        );
      })}
    </div>
  )
}

export default DailyOverviewMetrics;