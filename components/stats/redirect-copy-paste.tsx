import { ChartData } from 'chart.js';
import { LineChart } from '#components/chart/line';

export const RedirectAndCopyPasteChart: React.FC<{
  copyPasteAction: {
    value: number;
    label: string;
  }[];
  redirectedSiren: {
    value: number;
    label: string;
  }[];
}> = ({ redirectedSiren, copyPasteAction }) => {
  const data: ChartData<'line', number[], string> = {
    labels: redirectedSiren.map((redirected) => redirected.label),
    datasets: [
      {
        label: 'Recherche par siren',
        tension: 0.3,
        data: redirectedSiren.map((redirected) => redirected.value),
        borderColor: '#009FFD',
        backgroundColor: '#009FFD',
        pointStyle: (ctx) => (ctx.raw === 0 ? false : 'circle'),
        segment: {
          borderColor: (ctx) => {
            return ctx.p1.parsed.y === 0 ? 'transparent' : undefined;
          },
        },
      },
      {
        label: 'Copier-coller siren / siret',
        data: copyPasteAction.map((action) => action.value),
        borderColor: '#FCA311',
        backgroundColor: '#FCA311',
        pointStyle: (ctx) => (ctx.raw === 0 ? false : 'circle'),
        segment: {
          borderColor: (ctx) => {
            return ctx.p1.parsed.y === 0 ? 'transparent' : undefined;
          },
        },
      },
    ],
  };
  return <LineChart data={data} />;
};
