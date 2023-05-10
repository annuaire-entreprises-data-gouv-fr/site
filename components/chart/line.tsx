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
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { formatCurrency } from '#utils/helpers';

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
};

export const LineChart = ({ data, height = 250 }: LineChartProps) => {
  return (
    <div style={{ height: `${height}px` }}>
      <Line
        options={{
          plugins: {
            tooltip: {
              callbacks: {
                label(tooltipItem) {
                  return formatCurrency(
                    tooltipItem.parsed.y.toString()
                  ).toString();
                },
              },
            },
          },
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            y: {
              border: { display: false },
              ticks: {
                callback: (label) => {
                  return formatCurrency(label.toString());
                },
              },
            },
          },
        }}
        data={data}
      />
    </div>
  );
};
