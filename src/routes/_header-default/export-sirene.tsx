import { createFileRoute } from "@tanstack/react-router";
import ExportCsv from "#/components/screens/export-sirene/export-csv";
import { meta } from "#/seo";
import { HeaderDefaultError } from "./-error";

export const Route = createFileRoute("/_header-default/export-sirene")({
  head: () => {
    const canonical = "https://annuaire-entreprises.data.gouv.fr/export-sirene";
    return {
      meta: meta({
        title:
          "Générer une liste CSV d‘entreprises | L’Annuaire des Entreprises",
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
  errorComponent: HeaderDefaultError,
});

function RouteComponent() {
  return <ExportCsv />;
}
