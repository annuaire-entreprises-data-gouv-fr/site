import { ChartData } from 'chart.js';
import { IMatomoStats } from '#clients/matomo';
import { LineChart } from '#components/chart/line';
import { StackedBarChart } from '#components/chart/stack-bar';
import constants from '#models/constants';

export const NpsStats: React.FC<{
  monthlyNps: IMatomoStats['monthlyNps'];
}> = ({ monthlyNps }) => {
  const totalAvg =
    monthlyNps.reduce((sum, { values }) => sum + (values['all'].nps || 0), 0) /
    12;

  const dataLineChart: ChartData<'line'> = {
    labels: monthlyNps.map(({ label }) => label),
    datasets: [
      {
        backgroundColor: 'transparent',
        borderColor: constants.chartColors[0],
        borderWidth: 1,
        pointStyle: false,
        data: monthlyNps.map(() => totalAvg),
        label: 'Note moyenne sur l’année entière',
        tension: 0,
      },
      {
        backgroundColor: constants.chartColors[1],
        borderColor: constants.chartColors[1],
        data: monthlyNps.map(({ values }) => values['all'].nps || null),
        label: 'Note moyenne de tous les utilisateurs',
        tension: 0.3,
      },
      {
        backgroundColor: constants.chartColors[6],
        borderColor: constants.chartColors[6],
        data: monthlyNps.map(
          ({ values }) =>
            values['Agent public']?.nps ||
            values['Administration publique']?.nps ||
            null
        ),
        label: 'Note moyenne des agents',
        tension: 0.3,
      },
    ],
  };

  const usersType = Array.from(
    new Set(monthlyNps.map((m) => Object.keys(m.values)).flat())
  ).filter((v) => v !== 'all');

  const dataStackBarChart = {
    datasets: usersType.map((userType, index) => ({
      label: userType,
      data: monthlyNps.map(({ label, values }) => {
        const response = values[userType]?.npsResponses || 0;
        const userResponse = values['all']?.npsResponses || 0;
        return {
          y: (response * 100) / userResponse,
          x: label,
        };
      }),
      backgroundColor: constants.chartColors[index],
    })),
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
        scales={{
          x: {
            stacked: true,
          },
          y: {
            stacked: true,
            min: 1,
            max: 100,
          },
        }}
        options={{ scales: { y: { min: 1, max: 100 } } }}
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
