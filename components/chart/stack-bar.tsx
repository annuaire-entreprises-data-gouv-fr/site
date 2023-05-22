import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ChartData,
  ChartOptions,
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
  pluginOption?: ChartOptions<'bar'>['plugins'];
  options?: ChartOptions<'bar'>;
  scales?: ChartOptions<'bar'>['scales'];
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
  height = '400px',
  width = '100%',
  pluginOption,
  scales,
}: StackedBarChartProps) => {
  return (
    <div>
      <Bar
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
        height={height}
        data={data}
      />
    </div>
  );
};
