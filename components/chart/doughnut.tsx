import {
  Chart as ChartJS,
  CategoryScale,
  Title as ChartTitle,
  Tooltip,
  Legend,
  ChartData,
  ArcElement,
  ChartOptions,
} from 'chart.js';
import { Doughnut } from 'react-chartjs-2';

ChartJS.register(CategoryScale, ArcElement, ChartTitle, Tooltip, Legend);

type StackedBarChartProps = {
  options?: ChartOptions<'doughnut'>;
  height?: number | string;
  width?: number | string;
  data: ChartData<'doughnut', any, unknown>;
};

const defaultOptions: ChartOptions<'doughnut'> = {
  plugins: {
    legend: { position: 'right' },
  },
  responsive: true,
  cutout: '65%',
  maintainAspectRatio: false,
};

export const DoughnutChart = ({
  data,
  options = {},
  height = '400px',
  width = '100%',
}: StackedBarChartProps) => {
  return (
    <div>
      <Doughnut
        options={{
          ...defaultOptions,
          ...options,
          plugins: {
            ...defaultOptions.plugins,
            ...options.plugins,
          },
        }}
        width={width}
        height={height}
        data={{ ...data }}
      />
    </div>
  );
};
