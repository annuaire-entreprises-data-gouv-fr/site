import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title as ChartTitle,
  Tooltip,
  Legend,
  ChartData,
  ChartOptions,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { htmlLegendPlugin } from './html-legend-plugin';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ChartTitle,
  Tooltip,
  Legend
);

type LineChartProps = {
  data: ChartData<'line'>;
  options?: ChartOptions<'line'>;
  height?: number | string;
  width?: number | string;
  htmlLegendId?: string;
};

export const LineChart = ({
  data,
  options = {},
  height = '400px',
  width = '100%',
  // to use an html legend provide a unique id and disable canvas lengend in chart options
  htmlLegendId = '',
}: LineChartProps) => {
  const htmlLegendContainerId = htmlLegendId;

  return (
    <>
      {htmlLegendContainerId && (
        <div id={htmlLegendContainerId} className="layout-right" />
      )}
      <div>
        <Line
          options={{ ...options, maintainAspectRatio: false }}
          data={data}
          width={width}
          height={height}
          plugins={[
            ...(htmlLegendContainerId
              ? [htmlLegendPlugin(htmlLegendContainerId)]
              : []),
          ]}
        />
      </div>
    </>
  );
};
