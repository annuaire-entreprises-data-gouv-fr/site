import {
  CategoryScale,
  type ChartData,
  Chart as ChartJS,
  type ChartOptions,
  Title as ChartTitle,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Tooltip,
} from "chart.js";
import { Line } from "react-chartjs-2";
import { htmlLegendPlugin } from "./html-legend-plugin";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ChartTitle,
  Tooltip,
  Legend
);

interface LineChartProps {
  data: ChartData<"line">;
  height?: number | string;
  htmlLegendId?: string;
  options?: ChartOptions<"line">;
  width?: number | string;
}

export const LineChart = ({
  data,
  options = {},
  height = "400px",
  width = "100%",
  // to use an html legend provide a unique id and disable canvas lengend in chart options
  htmlLegendId = "",
}: LineChartProps) => {
  const htmlLegendContainerId = htmlLegendId;

  return (
    <>
      {htmlLegendContainerId && (
        <div className="layout-right" id={htmlLegendContainerId} />
      )}
      <div>
        <Line
          data={data}
          height={height}
          options={{ ...options, maintainAspectRatio: false }}
          plugins={[
            ...(htmlLegendContainerId
              ? [htmlLegendPlugin(htmlLegendContainerId)]
              : []),
          ]}
          width={width}
        />
      </div>
    </>
  );
};
