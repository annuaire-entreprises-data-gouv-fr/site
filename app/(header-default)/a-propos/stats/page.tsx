import { IMatomoStats, clientMatomoStats } from '#clients/matomo';
import { NpsStats } from '#components/stats/nps';
import { TraficStats } from '#components/stats/trafic';
import { UsageStats } from '#components/stats/usage';
import { Metadata } from 'next';

export const dynamic = 'force-static';
export const revalidate = 14400; // 4 * 3600 = 4 hours;

async function fetchStats(): Promise<IMatomoStats> {
  const {
    visits,
    monthlyNps,
    userResponses,
    mostCopied,
    copyPasteAction,
    redirectedSiren,
  } = await clientMatomoStats();
  return {
    visits,
    monthlyNps,
    userResponses,
    mostCopied,
    copyPasteAction,
    redirectedSiren,
  };
}

export const metadata: Metadata = {
  title: 'Statistiques d’utilisation de l’Annuaire des Entreprises',
  alternates: {
    canonical: 'https://annuaire-entreprises.data.gouv.fr/a-propos/stats',
  },
  robots: 'noindex, nofollow',
};

export default async function StatsPage() {
  const { monthlyNps, visits, mostCopied, copyPasteAction, redirectedSiren } =
    await fetchStats();

  return (
    <>
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
}
