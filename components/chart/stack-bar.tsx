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
  height?: number;
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
  height = 500,
}: StackedBarChartProps) => {
  return (
    <div
      style={{
        height: `${height}px`,
        display: 'flex',
        justifyContent: 'center',
      }}
    >
      <Bar options={options} data={data} />
    </div>
  );
};
