import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
} from "chart.js";
import { getTimeLabels } from "../shared/utils";
import { MS_IN_DAY, TIME_BLOCK } from "~/shared/constants";
ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement);

interface GraphCardProps {
  metricName: string;
  metricData?: any;
}

export default function GraphCard({ metricName, metricData }: GraphCardProps) {

  const timeLabels = getTimeLabels();

  console.log({timeLabels})
  const data = {
    labels: timeLabels,
    datasets: [
      {
        labels: metricName,
        data: metricData,
        backgroundColor: "#15376e",
        tension: 0.4,
        borderColor: "#29ea8a",
      },
    ],
  };

  const options = {
    scales: {
      y: {
        display: true,
      },
    },
  };

  return (
    <div className="flex-1 group flex flex-col justify-between rounded-sm bg-white p-4 shadow-xl transition-shadow sm:p-6 lg:p-8">
      <div>
        <h3 className="font-medium text-gray-900 text-center mb-2">{metricName}</h3>
      </div>
      <div>
        <Line data={viewableData} options={options}></Line>
      </div>
    </div>
  );
}
