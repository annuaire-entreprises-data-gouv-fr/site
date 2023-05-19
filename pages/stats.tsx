import { GetStaticProps } from 'next';
import { clientMatomoStats, IMatomoStats } from '#clients/matomo';
import Meta from '#components/meta';
import { NpsStats } from '#components/stats/nps';
import { TraficStats } from '#components/stats/trafic';
import { UsageStats } from '#components/stats/usage';
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
    <NpsStats
      monthlyAgentNps={monthlyAgentNps}
      monthlyUserNps={monthlyUserNps}
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
