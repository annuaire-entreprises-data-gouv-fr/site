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
import { formatMoney } from '#utils/helpers';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ChartTitle,
  Tooltip,
  Legend
);

type LineChatProps = {
  height?: number;
  data: ChartData<'line', number[], string>;
};

export const LineChart = ({ data, height = 250 }: LineChatProps) => {
  return (
    <div style={{ height: `${height}px` }}>
      <Line
        options={{
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            y: {
              border: { display: false },
              ticks: {
                callback: (label) => {
                  return formatMoney(label.toString());
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
