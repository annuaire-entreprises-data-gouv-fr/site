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
  data: ChartData<'line', (number | null)[], string>;
  options?: ChartOptions<'line'>;
  height?: number | string;
  width?: number | string;
};

export const LineChart = ({
  data,
  options = {},
  height = '400px',
  width = '100%',
}: LineChartProps) => {
  return (
    <div>
      <Line
        options={{ ...options, maintainAspectRatio: false }}
        data={data}
        width={width}
        height={height}
      />
    </div>
  );
};
