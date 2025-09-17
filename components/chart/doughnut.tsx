import {
  ArcElement,
  CategoryScale,
  ChartData,
  Chart as ChartJS,
  ChartOptions,
  Title as ChartTitle,
  Legend,
  Tooltip,
} from 'chart.js';
import { Doughnut } from 'react-chartjs-2';

ChartJS.register(CategoryScale, ArcElement, ChartTitle, Tooltip, Legend);

type StackedBarChartProps = {
  height?: number | string;
  width?: number | string;
  data: ChartData<'doughnut', any, unknown>;
  usePercentage?: boolean;
  pluginOptions?: ChartOptions<'doughnut'>['plugins'];
};

const options: ChartOptions<'doughnut'> = {
  responsive: true,
  cutout: '65%',
  maintainAspectRatio: false,
};

export const DoughnutChart = ({
  data,
  height = '400px',
  width = '100%',
  pluginOptions = {},
}: StackedBarChartProps) => {
  return (
    <div>
      <Doughnut
        options={{
          ...options,
          plugins: {
            ...options.plugins,
            ...pluginOptions,
          },
        }}
        width={width}
        height={height}
        data={data}
      />
    </div>
  );
};
