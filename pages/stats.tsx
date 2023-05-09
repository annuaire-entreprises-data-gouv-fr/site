import { GetStaticProps } from 'next';
import { useState } from 'react';
import { clientMatomoStats, IMatomoStats } from '#clients/matomo';
import BasicChart from '#components/chart/basic';
import { StackedBarChart } from '#components/chart/stack-bar';
import Meta from '#components/meta';
import { NextPageWithLayout } from './_app';

const colors = [
  '#0078f3',
  '#F7BA02',
  '#E83036',
  '#D90368',
  '#820263',
  '#291720',
];

const StatsPage: NextPageWithLayout<IMatomoStats> = ({
  monthlyUserNps,
  visits,
  userResponses,
  mostCopied,
}) => {
  const [statsType, setStatsType] = useState<'visits' | 'visitor'>('visits');
  const data = {
    datasets: [
      {
        label: 'Visite',
        data: visits.map(({ label, visitor }) => ({
          y: visitor.returning,
          x: label,
        })),
        backgroundColor: 'rgb(255, 99, 132)',
      },
      {
        label: 'Nouvelle visite',
        data: visits.map(({ label, visitor }) => ({
          y: visitor.new,
          x: label,
        })),
        backgroundColor: 'rgb(75, 192, 192)',
      },
    ],
  };

  return (
    <>
      <Meta
        title="Statistiques d’utilisation de l’Annuaire des Entreprises"
        noIndex={true}
      />
      <h1>Statistiques d’utilisation</h1>
      <p>
        Découvrez nos statistiques d’utilisation mises à jour quotidiennement.
        Toutes les données recueillies sont <a href="vie-privee">anonymisées</a>
        .
      </p>
      <h2>Usage du service</h2>
      <h3>Visites mensuelles</h3>
      <script
        src="https://cdnjs.cloudflare.com/ajax/libs/Chart.js/3.7.0/chart.min.js"
        integrity="sha512-TW5s0IT/IppJtu76UbysrBH9Hy/5X41OTAbQuffZFU6lQ1rdcLHzpU5BzVvr/YFykoiMYZVWlr/PX1mDcfM9Qg=="
        crossOrigin="anonymous"
        referrerPolicy="no-referrer"
      ></script>
      <h3>Informations les plus utilisées par les usagers</h3>
      <fieldset
        style={{ display: 'flex', flexDirection: 'row', gap: 32 }}
        className="fr-fieldset"
        id="radio-inline"
        aria-labelledby="radio-inline-legend radio-inline-messages"
      >
        <div
          onChange={(values) => console.log(values)}
          className="fr-fieldset__element fr-fieldset__element--inline"
        >
          <div className="fr-radio-group">
            <input
              type="radio"
              name="stats-type"
              value="visits"
              onClick={() => setStatsType('visits')}
            />
            <label className="fr-label">Visites</label>
          </div>
        </div>
        <div className="fr-fieldset__element fr-fieldset__element--inline">
          <div className="fr-radio-group">
            <input
              type="radio"
              name="stats-type"
              value="visitor"
              onClick={() => {
                setStatsType('visitor');
              }}
            />
            <label className="fr-label">Visiteurs</label>
          </div>
        </div>

        <div
          className="fr-messages-group"
          id="radio-inline-messages"
          aria-live="assertive"
        ></div>
      </fieldset>
      <StackedBarChart data={data} />
      <BasicChart
        yLabel="Informations"
        stacked={true}
        horizontal={true}
        height={50}
        yRange={[0, 100]}
        type="bar"
        labels={['']}
        datasets={Object.keys(mostCopied).map((copiedKey, index) => {
          return {
            label: copiedKey,
            data: [mostCopied[copiedKey]],
            backgroundColor: colors[index],
          };
        })}
      />
      <h2>Satisfaction des utilisateurs</h2>
      Analyse des réponses au{' '}
      <a href="/formulaire/nps">questionnaire de statisfaction</a>.
      <h3>Score de satisfaction</h3>
      Ce qui nous intéresse avec ce score n’est pas sa valeur, mais ses
      variations. Si le score augmente, c’est que le service évolue dans le bon
      sens et inversement.
      <BasicChart
        yLabel="Note sur 10"
        type="bar"
        yRange={[0, 10]}
        datasets={[
          {
            label: 'Note moyenne',
            data: monthlyUserNps.map((month) => {
              return {
                y: month.nps,
                x: month.label,
              };
            }),
            type: 'line',
            backgroundColor: colors[0],
            borderColor: colors[0],
            cubicInterpolationMode: 'monotone',
            tension: 0.4,
          },
        ]}
      />
      <h3>Répartition des réponses par catégorie d’utilisateurs</h3>
      <BasicChart
        yLabel="Répartition"
        stacked={true}
        horizontal={true}
        yRange={[0, 100]}
        height={50}
        type="bar"
        labels={['']}
        datasets={Object.keys(userResponses).map((userTypeKey, index) => {
          return {
            label: userTypeKey,
            data: [userResponses[userTypeKey].value],
            backgroundColor: colors[index + 1],
          };
        })}
      />
    </>
  );
};

export const getStaticProps: GetStaticProps = async () => {
  const { visits, monthlyUserNps, userResponses, mostCopied } =
    await clientMatomoStats();
  return {
    props: {
      monthlyUserNps,
      visits,
      userResponses,
      mostCopied,
      metadata: {
        useReact: true,
      },
    },
    revalidate: 4 * 3600, // In seconds - 4 hours
  };
};

export default StatsPage;
