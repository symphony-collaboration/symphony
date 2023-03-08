import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
} from "chart.js";

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement);

interface GraphCardProps {
  metricName: string;
  data?: any;
}

export default function GraphCard({ metricName }: GraphCardProps) {
  const getCurrentTime = (): string => {
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, "0"); // Get the hours and pad with leading zero if needed
    const minutes = now.getMinutes().toString().padStart(2, "0"); // Get the minutes and pad with leading zero if needed
    const time = `${hours}:${minutes}`; // Combine the hours and minutes into a string in the 24-hour format
    return time;
  };

  const data = {
    labels: [`Yesterday ${getCurrentTime()}`].concat(Array(5).fill('')).concat([`Today ${getCurrentTime()}`]),
    datasets: [
      {
        labels: "Sales of the week",
        data: [3, 6, 5, 2, 7, 3, 4],
        backgroundColor: "aqua",
        tension: 0.4,
        borderColor: "#4f46e5",
      },
    ],
  };

  const options = {
    scales: {
      y: {
        display: false,
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
