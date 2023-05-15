import { GetStaticProps } from 'next';
import { clientMatomoStats, IMatomoStats } from '#clients/matomo';
import BasicChart from '#components/chart/basic';
import Meta from '#components/meta';
import { ScoreNpsStats } from '#components/stats/score-nps';
import { TraficStats } from '#components/stats/trafic';
import { UsageStats } from '#components/stats/usage';
import constants from '#models/constants';
import { NextPageWithLayout } from './_app';

const StatsPage: NextPageWithLayout<IMatomoStats> = ({
  monthlyAgentNps,
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
    <h3>Volume de visite</h3>
    <TraficStats visits={visits} />
    <br />
    <h3>À quoi sert l’Annuaire des Entreprises ?</h3>
    <UsageStats
      copyPasteAction={copyPasteAction}
      redirectedSiren={redirectedSiren}
      mostCopied={mostCopied}
    />
    <h2>Satisfaction des utilisateurs</h2>
    Analyse des réponses au{' '}
    <a href="/formulaire/nps">questionnaire de statisfaction</a>.
    <h3>Score de satisfaction</h3>
    Ce qui nous intéresse avec ce score n’est pas sa valeur, mais ses
    variations. Si le score augmente, c’est que le service évolue dans le bon
    sens et inversement.
    <ScoreNpsStats
      monthlyAgentNps={monthlyAgentNps}
      monthlyUserNps={monthlyUserNps}
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
          backgroundColor: constants.chartColors[index + 1],
        };
      })}
    />
  </>
);

export const getStaticProps: GetStaticProps = async () => {
  const {
    visits,
    monthlyAgentNps,
    monthlyUserNps,
    userResponses,
    mostCopied,
    copyPasteAction,
    redirectedSiren,
  } = await clientMatomoStats();
  return {
    props: {
      monthlyAgentNps,
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
