import { ChartData } from 'chart.js';
import { IMatomoStats } from '#clients/matomo';
import { LineChart } from '#components/chart/line';
import { StackedBarChart } from '#components/chart/stack-bar';
import constants from '#models/constants';

export const NpsStats: React.FC<{
  monthlyAgentNps: IMatomoStats['monthlyAgentNps'];
  monthlyUserNps: IMatomoStats['monthlyUserNps'];
}> = ({ monthlyAgentNps, monthlyUserNps }) => {
  const totalAvg =
    monthlyUserNps.reduce((sum, { nps }) => sum + (nps || 0), 0) / 12;

  const dataLineChart: ChartData<'line'> = {
    labels: monthlyAgentNps.map(({ label }) => label),
    datasets: [
      {
        backgroundColor: 'transparent',
        borderColor: constants.chartColors[0],
        borderWidth: 1,
        pointStyle: false,
        data: monthlyUserNps.map(() => totalAvg),
        label: 'Note moyenne sur l’année entière',
        tension: 0,
      },
      {
        backgroundColor: constants.chartColors[1],
        borderColor: constants.chartColors[1],
        data: monthlyUserNps.map(({ nps }) => nps || null),
        label: 'Note moyenne de tous les utilisateurs',
        tension: 0.3,
      },
      {
        backgroundColor: constants.chartColors[6],
        borderColor: constants.chartColors[6],
        data: monthlyAgentNps.map(({ nps }) => nps || null),
        label: 'Note moyenne des agents',
        tension: 0.3,
      },
    ],
  };

  const dataStackBarChart = {
    datasets: [
      {
        label: 'Agent publics',
        data: monthlyAgentNps.map(({ label, npsResponses }, index) => {
          const response = npsResponses || 0;
          const userResponse = monthlyUserNps[index].npsResponses || 0;
          return {
            y: (response * 100) / (response + userResponse),
            x: label,
          };
        }),
        backgroundColor: constants.chartColors[3],
      },
      {
        label: 'Autres',
        data: monthlyUserNps.map(({ label, npsResponses }, index) => {
          const response = npsResponses || 0;
          const agentResponse = monthlyAgentNps[index].npsResponses || 0;
          return {
            y: (response * 100) / (response + agentResponse),
            x: label,
          };
        }),
        backgroundColor: constants.chartColors[4],
      },
    ],
  };

  return (
    <>
      Les chiffres de cette section proviennent de l’analyse des réponses au{' '}
      <a href="/formulaire/nps">questionnaire de statisfaction</a>.
      <h3>Score de satisfaction</h3>
      <p>
        Le score de satisfaction est un peu comme un thermomètre. Il permet de
        déterminer si les utilisateurs sont satisfaits du service et de ses
        évolutions.
        <br />
        Ce qui nous intéresse avec ce score n’est pas tant sa valeur que ses
        écarts à la moyenne.
      </p>
      <LineChart
        data={dataLineChart}
        height="250px"
        options={{
          responsive: true,
          scales: {
            y: {
              title: { display: true, text: 'Note sur 10' },
              min: 0,
              max: 10,
              ticks: { stepSize: 1 },
            },
          },
        }}
      />
      <h3>Qui sont les utilisateurs de l’Annuaire des Entreprises ?</h3>
      <p>
        Les réponses du formulaire de statisfaction nous permettent de
        constituer une “image” de la répartition de nos utilisateurs.
      </p>
      <b>Attention,</b> le formulaire est le plus souvent rempli par des
      utilisateurs récurrents, donc cette “image” est nettement influencée par
      ces derniers.
      <StackedBarChart
        height="300px"
        data={dataStackBarChart}
        pluginOption={{
          legend: { onClick: () => undefined },
          tooltip: {
            callbacks: {
              label(context) {
                return `${context.dataset.label} ${Math.round(
                  context.parsed.y
                )}%`;
              },
            },
          },
        }}
      />
      <br />
    </>
  );
};
