import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ChartData,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

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
  data: ChartData<'bar', any, unknown>;
};

const options = {
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
  height = '400px',
  width = '100%',
}: StackedBarChartProps) => {
  return (
    <Bar
      options={{ ...options, maintainAspectRatio: false }}
      width={width}
      height={height}
      data={data}
    />
  );
};
