import { clientMatomoStats, IMatomoStats } from '#clients/matomo';
import Meta from '#components/meta';
import { NpsStats } from '#components/stats/nps';
import { TraficStats } from '#components/stats/trafic';
import { UsageStats } from '#components/stats/usage';
import { GetStaticProps } from 'next';
import { NextPageWithLayout } from '../_app';

const StatsPage: NextPageWithLayout<IMatomoStats> = ({
  monthlyNps,
  visits,
  mostCopied,
  copyPasteAction,
  redirectedSiren,
}) => (
  <>
    <Meta
      title="Statistiques d’utilisation de l’Annuaire des Entreprises"
      canonical="https://annuaire-entreprises.data.gouv.fr/a-propos/stats"
      noIndex={true}
    />
    <h1>Statistiques d’utilisation</h1>
    <p>
      Découvrez nos statistiques d’utilisation. Toutes les données recueillies
      sont <a href="/vie-privee">anonymisées</a>.
    </p>
    <h2>Utilisation du service</h2>
    <TraficStats visits={visits} />
    <br />
    <h2>Comment est utilisé l’Annuaire des Entreprises ?</h2>
    <UsageStats
      copyPasteAction={copyPasteAction}
      redirectedSiren={redirectedSiren}
      mostCopied={mostCopied}
    />
    <h2>Satisfaction des utilisateurs</h2>
    <NpsStats monthlyNps={monthlyNps} />
    <br />
  </>
);

export const getStaticProps: GetStaticProps = async () => {
  const {
    visits,
    monthlyNps,
    userResponses,
    mostCopied,
    copyPasteAction,
    redirectedSiren,
  } = await clientMatomoStats();
  return {
    props: {
      monthlyNps,
      visits,
      userResponses,
      mostCopied,
      copyPasteAction,
      redirectedSiren,
    },
    revalidate: 4 * 3600, // In seconds - 4 hours
  };
};

export default StatsPage;
