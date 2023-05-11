import { GetStaticProps } from 'next';
import { clientMatomoStats, IMatomoStats } from '#clients/matomo';
import BasicChart from '#components/chart/basic';
import Meta from '#components/meta';
import { RedirectAndCopyPasteChart } from '#components/stats/redirect-copy-paste';
import { TraficStats } from '#components/stats/trafic';
import { NextPageWithLayout } from './_app';

const colors = [
  '#e60049',
  '#0bb4ff',
  '#50e991',
  '#e6d800',
  '#9b19f5',
  '#ffa300',
  '#dc0ab4',
  '#b3d4ff',
  '#00bfa0',
];

const StatsPage: NextPageWithLayout<IMatomoStats> = ({
  monthlyUserNps,
  visits,
  userResponses,
  mostCopied,
  copyPasteAction,
  redirectedSiren,
}) => (
  <>
    <Meta
      title="Statistiques d’utilisation de l’Annuaire des Entreprises"
      noIndex={true}
    />
    <script
      src="https://cdnjs.cloudflare.com/ajax/libs/Chart.js/3.7.0/chart.min.js"
      integrity="sha512-TW5s0IT/IppJtu76UbysrBH9Hy/5X41OTAbQuffZFU6lQ1rdcLHzpU5BzVvr/YFykoiMYZVWlr/PX1mDcfM9Qg=="
      crossOrigin="anonymous"
      referrerPolicy="no-referrer"
    ></script>
    <h1>Statistiques d’utilisation</h1>
    <p>
      Découvrez nos statistiques d’utilisation mises à jour quotidiennement.
      Toutes les données recueillies sont <a href="vie-privee">anonymisées</a>.
    </p>
    <h2>Utilisation du service</h2>
    <h3>Trafic mensuel</h3>
    <TraficStats visits={visits} colors={colors} />
    <RedirectAndCopyPasteChart
      copyPasteAction={copyPasteAction}
      redirectedSiren={redirectedSiren}
    />
    <br />
    <h3>Informations les plus utilisées par les usagers</h3>
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

export const getStaticProps: GetStaticProps = async () => {
  const {
    visits,
    monthlyUserNps,
    userResponses,
    mostCopied,
    copyPasteAction,
    redirectedSiren,
  } = await clientMatomoStats();
  return {
    props: {
      monthlyUserNps,
      visits,
      userResponses,
      mostCopied,
      copyPasteAction,
      redirectedSiren,
      metadata: {
        useReact: true,
      },
    },
    revalidate: 4 * 3600, // In seconds - 4 hours
  };
};

export default StatsPage;
