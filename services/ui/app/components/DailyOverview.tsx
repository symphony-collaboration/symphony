import GraphCard from "~/components/GraphCard";import type { GraphCardInterface } from "~/components/types";
import { TIME_BLOCK } from "~/shared/constants";


interface DashboardOverviewMetricsProps {
  metrics: GraphCardInterface[];
}

/*
collection of connection event objects over past 24 hours
  - roomName
  - timestamp -formatted

  Active Rooms
    - 

  Active Connections

  output: time-represented data

  - 7 data points

  2 data points at the end

  5 data ponits between

  split 24 hours evenly into 7 blocks

  for each 7 hour block
    - get SUM of unique rooms
    - get connections sum
  
  00 - 24
  24 / 7
*/

const DailyOverviewMetrics = ({metrics}: DashboardOverviewMetricsProps) => {

  console.log("in daily overview m component", {metrics})

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