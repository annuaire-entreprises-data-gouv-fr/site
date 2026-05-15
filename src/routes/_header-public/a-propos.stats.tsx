import { createFileRoute } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { clientMatomoStats } from "#/clients/matomo";
import { Link } from "#/components/Link";
import { NpsStats } from "#/components/stats/nps";
import { TraficStats } from "#/components/stats/trafic";
import { UsageStats } from "#/components/stats/usage";
import { meta } from "#/utils/seo";
import { HeaderPublicError } from "./-error";

const fetchStatsFn = createServerFn().handler(async () => {
  const { visits, monthlyNps, mostCopied, copyPasteAction, redirectedSiren } =
    await clientMatomoStats();
  return {
    visits,
    monthlyNps,
    mostCopied,
    copyPasteAction,
    redirectedSiren,
  };
});

export const Route = createFileRoute("/_header-public/a-propos/stats")({
  loader: async () => await fetchStatsFn(),
  head: () => {
    const canonical =
      "https://annuaire-entreprises.data.gouv.fr/a-propos/stats";
    return {
      meta: meta({
        title: "Statistiques d’utilisation de l’Annuaire des Entreprises",
        robots: "noindex, follow",
        alternates: {
          canonical,
        },
      }),
      links: [
        {
          rel: "canonical",
          href: canonical,
        },
      ],
    };
  },
  component: RouteComponent,
  errorComponent: HeaderPublicError,
});

function RouteComponent() {
  const { visits, monthlyNps, mostCopied, copyPasteAction, redirectedSiren } =
    Route.useLoaderData();

  return (
    <>
      <h1>Statistiques d’utilisation</h1>
      <p>
        Découvrez nos statistiques d’utilisation. Toutes les données recueillies
        sont <Link to="/vie-privee">anonymisées</Link>.
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
