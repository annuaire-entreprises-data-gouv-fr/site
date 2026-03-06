import {
  ArcElement,
  CategoryScale,
  type ChartData,
  Chart as ChartJS,
  type ChartOptions,
  Title as ChartTitle,
  Legend,
  Tooltip,
} from "chart.js";
import { Doughnut } from "react-chartjs-2";

ChartJS.register(CategoryScale, ArcElement, ChartTitle, Tooltip, Legend);

interface StackedBarChartProps {
  data: ChartData<"doughnut", any, unknown>;
  height?: number | string;
  pluginOptions?: ChartOptions<"doughnut">["plugins"];
  usePercentage?: boolean;
  width?: number | string;
}

const options: ChartOptions<"doughnut"> = {
  responsive: true,
  cutout: "65%",
  maintainAspectRatio: false,
};

export const DoughnutChart = ({
  data,
  height = "400px",
  width = "100%",
  pluginOptions = {},
}: StackedBarChartProps) => (
  <div>
    <Doughnut
      data={data}
      height={height}
      options={{
        ...options,
        plugins: {
          ...options.plugins,
          ...pluginOptions,
        },
      }}
      width={width}
    />
  </div>
);
