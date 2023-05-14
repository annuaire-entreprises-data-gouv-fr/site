import {
  Chart as ChartJS,
  CategoryScale,
  Title as ChartTitle,
  Tooltip,
  Legend,
  ChartData,
  ArcElement,
} from 'chart.js';
import { Doughnut } from 'react-chartjs-2';

ChartJS.register(CategoryScale, ArcElement, ChartTitle, Tooltip, Legend);

type StackedBarChartProps = {
  height?: number | string;
  width?: number | string;
  data: ChartData<'doughnut', any, unknown>;
};

const options = {
  plugins: {
    legend: { position: 'right' },
    title: false,
  },
  responsive: true,
  cutout: '65%',
};

export const PieChart = ({
  data,
  height = '400px',
  width = '100%',
}: StackedBarChartProps) => {
  return (
    <div>
      <Doughnut
        options={{ ...options, maintainAspectRatio: false }}
        width={width}
        height={height}
        data={data}
      />
    </div>
  );
};
