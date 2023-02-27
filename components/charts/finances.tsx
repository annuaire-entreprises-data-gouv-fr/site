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
import { formatNumber } from '#utils/helpers';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ChartTitle,
  Tooltip,
  Legend
);

type FinanceChatProps = {
  data: ChartData<'line', number[], string>;
};

export const FinanceChart = ({ data }: FinanceChatProps) => {
  return (
    <div>
      <Line
        options={{
          responsive: true,
          scales: {
            y: {
              border: { display: false },
              ticks: {
                callback: (label) => {
                  return formatNumber(label.toString());
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
