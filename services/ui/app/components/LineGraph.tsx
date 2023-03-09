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
  data?: any;
}
