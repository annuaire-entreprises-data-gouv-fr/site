import type { Metadata } from "next";
import { clientMatomoStats, type IMatomoStats } from "#clients/matomo";
import { Link } from "#components/Link";
import { NpsStats } from "#components/stats/nps";
import { TraficStats } from "#components/stats/trafic";
import { UsageStats } from "#components/stats/usage";

export const dynamic = "force-dynamic";

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
  title: "Statistiques d’utilisation de l’Annuaire des Entreprises",
  alternates: {
    canonical: "https://annuaire-entreprises.data.gouv.fr/a-propos/stats",
  },
  robots: "noindex, follow",
};

export default async function StatsPage() {
  const { monthlyNps, visits, mostCopied, copyPasteAction, redirectedSiren } =
    await fetchStats();

  return (
    <>
      <h1>Statistiques d’utilisation</h1>
      <p>
        Découvrez nos statistiques d’utilisation. Toutes les données recueillies
        sont <Link href="/vie-privee">anonymisées</Link>.
      </p>
      <h2>Utilisation du service</h2>
      <TraficStats visits={visits} />
      <br />
      <h2>Comment est utilisé l’Annuaire des Entreprises ?</h2>
      <UsageStats
        copyPasteAction={copyPasteAction}
        mostCopied={mostCopied}
        redirectedSiren={redirectedSiren}
      />
      <h2>Satisfaction des utilisateurs</h2>
      <NpsStats monthlyNps={monthlyNps} />
      <br />
    </>
  );
}
