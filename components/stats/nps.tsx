import { ChartData } from 'chart.js';
import { ChangeEvent, useState } from 'react';
import { IMatomoStats } from '#clients/matomo';
import { Select } from '#components-ui/select';
import { LineChart } from '#components/chart/line';
import { StackedBarChart } from '#components/chart/stack-bar';
import constants from '#models/constants';

export const NpsStats: React.FC<{
  monthlyNps: IMatomoStats['monthlyNps'];
}> = ({ monthlyNps }) => {
  const [statsType, setStatsType] = useState<'avg' | 'nps'>('avg');

  const totalAvg =
    monthlyNps.reduce(
      (sum, { values }) => sum + (values['all'][statsType] || 0),
      0
    ) / 12;

  const npsMaxRange = statsType === 'avg' ? 10 : 100;
  const npsPrefixLabel = statsType === 'avg' ? 'Note moyenne' : 'NPS';

  const dataLineChart: ChartData<'line'> = {
    labels: monthlyNps.map(({ label }) => label),
    datasets: [
      {
        backgroundColor: 'transparent',
        borderColor: constants.chartColors[0],
        borderWidth: 1,
        pointStyle: false,
        data: monthlyNps.map(() => totalAvg),
        label: `${npsPrefixLabel} sur l’année entière`,
        tension: 0,
      },
      {
        backgroundColor: constants.chartColors[2],
        borderColor: constants.chartColors[2],
        data: monthlyNps.map(({ values }) => values['all'][statsType] || null),
        label: `${npsPrefixLabel} de tous les utilisateurs`,
        tension: 0.3,
      },
      {
        backgroundColor: constants.chartColors[6],
        borderColor: constants.chartColors[6],
        data: monthlyNps.map(
          ({ values }) => values['Agent public'][statsType],
          null
        ),
        label: `${npsPrefixLabel} des agents`,
        tension: 0.3,
      },
    ],
  };

  const userTypes = [
    { label: 'Agent public', color: constants.chartColors[6] },
    { label: 'Dirigeant', color: constants.chartColors[1] },
    { label: 'Salarié', color: constants.chartColors[7] },
    { label: 'Indépendant', color: `${constants.chartColors[1]}99` },
    { label: 'Particulier', color: constants.chartColors[5] },
    { label: 'Autre', color: constants.chartColors[3] },
  ];

  const userTypesData = {
    datasets: userTypes.map((userType) => ({
      label: userType.label,
      data: monthlyNps.map(({ label, values }) => {
        const response = values[userType.label]?.count || 0;
        const userResponse = values['all']?.count || 0;
        return {
          y: userResponse ? (response * 100) / userResponse : 0,
          x: label,
        };
      }),
      backgroundColor: userType.color,
    })),
  };

  const onOptionChange = (e: ChangeEvent<HTMLInputElement>) => {
    setStatsType(e.target.value as 'nps' | 'avg');
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
      <p>
        Les données sont consultables sous deux formes : la <b>note moyenne</b>{' '}
        et le <b>Net Promoter Score (NPS)</b>. Le NPS est la différence entre
        les promoteurs (notes {'>'} 8/10) et les détracteurs (notes {'<'} 7/10).
        Il permet d’estimer les chances qu’a un produit d’être recommandé par
        ses utilisateurs et utilisatrices.
      </p>
      <br />
      <div className="layout-right">
        <div>Afficher les données par&nbsp;</div>
        <Select
          options={[
            { value: 'avg', label: 'note moyenne' },
            { value: 'nps', label: 'net promoter score (NPS)' },
          ]}
          defaultValue={'avg'}
          onChange={onOptionChange}
        />
      </div>
      <br />
      <LineChart
        data={dataLineChart}
        height="250px"
        options={{
          responsive: true,
          scales: {
            y: {
              title: {
                display: true,
                text: statsType === 'avg' ? 'Note sur 10' : 'NPS',
              },
              min: 0,
              max: npsMaxRange,
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
