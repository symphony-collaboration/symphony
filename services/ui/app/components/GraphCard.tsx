import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
} from "chart.js";
import { getCurrent24HrTime } from "../shared/utils";

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement);

interface GraphCardProps {
  metricName: string;
  metricData?: any;
}

export default function GraphCard({ metricName, metricData }: GraphCardProps) {
  const data = {
    labels: [`Yesterday ${getCurrent24HrTime()}`]
      .concat(Array(5).fill(""))
      .concat([`Today ${getCurrent24HrTime()}`]),
    datasets: [
      {
        labels: "Sales of the week",
        data: metricData,
        backgroundColor: "aqua",
        tension: 0.4,
        borderColor: "#4f46e5",
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
        <h3 className="font-medium text-gray-900">{metricName}</h3>
        <div className="border-t-2 border-gray-100 pt-1">
          <p className="mt-1 text-sm text-gray-700">Localhost</p>
        </div>
      </div>
      <div>
        <Line data={data} options={options}></Line>
      </div>
    </div>
  );
}
