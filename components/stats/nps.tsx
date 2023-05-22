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
        backgroundColor: constants.chartColors[2],
        borderColor: constants.chartColors[2],
        data: monthlyNps.map(({ values }) => values['all'].nps || null),
        label: 'Note moyenne de tous les utilisateurs',
        tension: 0.3,
      },
      {
        backgroundColor: constants.chartColors[6],
        borderColor: constants.chartColors[6],
        data: monthlyNps.map(({ values }) => values['Agent public']?.nps, null),
        label: 'Note moyenne des agents',
        tension: 0.3,
      },
    ],
  };

  const userTypes = [
    { label: 'Agent public', color: constants.chartColors[6] },
    { label: 'Dirigeant', color: constants.chartColors[1] },
    { label: 'Salarié', color: constants.chartColors[7] },
    { label: 'Indépendant', color: `${constants.chartColors[1]}99` },
    { label: 'Association', color: constants.chartColors[4] },
    { label: 'Particulier', color: constants.chartColors[5] },
    { label: 'Autre', color: constants.chartColors[3] },
  ];

  const userTypesData = {
    datasets: userTypes.map((userType) => ({
      label: userType.label,
      data: monthlyNps.map(({ label, values }) => {
        const response = values[userType.label]?.npsResponses || 0;
        const userResponse = values['all']?.npsResponses || 0;
        return {
          y: userResponse ? (response * 100) / userResponse : 0,
          x: label,
        };
      }),
      backgroundColor: userType.color,
    })),
  };

  return (
    <>
      Les chiffres de cette section proviennent de l’analyse des réponses au{' '}
      <a href="/formulaire/nps">questionnaire de statisfaction</a>.
      <h3>Score de satisfaction</h3>
      <p>
        Le score de satisfaction agit comme un thermomètre. Il permet de
        déterminer si les utilisateurs sont satisfaits du service et de ses
        évolutions.
        <br />
        Ce score nous intéresse non pas pour sa valeur absolue mais pour ses
        variations par rapport à la moyenne.
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
        Les réponses au formulaire de statisfaction nous permettent de
        constituer une “image” de nos utilisateurs.
      </p>
      Cependant, le formulaire est le plus souvent rempli par des{' '}
      <b>utilisateurs récurrents</b>. Cette “image” est donc plus représentative
      de ces derniers que de l’ensemble des utilisateurs du site.
      <StackedBarChart
        height="300px"
        data={userTypesData}
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
    </>
  );
};
