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
  height?: number;
  data: ChartData<'line', number[], string>;
  options?: ChartOptions<'line'>;
};

export const LineChart = ({
  data,
  options = {},
  height = 500,
}: LineChartProps) => {
  return (
    <div style={{ height: `${height}px` }}>
      <Line options={options} data={data} />
    </div>
  );
};
