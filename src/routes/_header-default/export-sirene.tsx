import { createFileRoute, stripSearchParams } from "@tanstack/react-router";
import ExportCsv from "#/components/screens/export-sirene/export-csv";
import {
  defaultExportSireneSearch,
  exportSireneSearchSchema,
} from "#/components/screens/export-sirene/search-params";
import { meta } from "#/utils/seo";
import { HeaderDefaultError } from "./-error";

export const Route = createFileRoute("/_header-default/export-sirene")({
  validateSearch: exportSireneSearchSchema,
  search: {
    middlewares: [stripSearchParams(defaultExportSireneSearch)],
  },
  head: () => {
    const canonical = "https://annuaire-entreprises.data.gouv.fr/export-sirene";
    return {
      meta: meta({
        title:
          "Générer une liste CSV d‘entreprises | L’Annuaire des Entreprises",
        robots: "index, follow",
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
