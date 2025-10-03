import {
  BarElement,
  CategoryScale,
  type ChartData,
  Chart as ChartJS,
  type ChartOptions,
  Legend,
  LinearScale,
  Title,
  Tooltip,
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

type StackedBarChartProps = {
  height?: number | string;
  width?: number | string;
  data: ChartData<"bar", any, unknown>;
  pluginOption?: ChartOptions<"bar">["plugins"];
  options?: ChartOptions<"bar">;
  scales?: ChartOptions<"bar">["scales"];
};

const defaultOptions = {
  plugins: {
    title: {
      display: true,
    },
  },
  responsive: true,
  scales: {
    x: {
      stacked: true,
    },
    y: {
      stacked: true,
    },
  },
};

export const StackedBarChart = ({
  data,
  height = "400px",
  width = "100%",
  pluginOption,
  scales,
}: StackedBarChartProps) => (
  <div>
    <Bar
      data={data}
      height={height}
      options={{
        ...defaultOptions,
        scales: {
          ...defaultOptions.scales,
          ...scales,
        },
        plugins: {
          ...defaultOptions.plugins,
          ...pluginOption,
        },
        maintainAspectRatio: false,
      }}
      width={width}
    />
  </div>
);
