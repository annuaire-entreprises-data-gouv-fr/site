import { createFileRoute, notFound } from "@tanstack/react-router";
import ActesSection from "#/components/screens/documents.$slug/actes";
import {
  ConformiteFiscaleSection,
  ConformiteSocialeSection,
} from "#/components/screens/documents.$slug/conformite";
import JustificatifsSection from "#/components/screens/documents.$slug/justificatifs";
import { SummaryDocuments } from "#/components/screens/documents.$slug/summary-documents";
import TravauxPublicsSection from "#/components/screens/documents.$slug/travaux-publics";
import { NotFound } from "#/components/screens/not-found";
import { HorizontalSeparator } from "#/components-ui/horizontal-separator";
import BreakPageForPrint from "#/components-ui/print-break-page";
import { PrintNever } from "#/components-ui/print-visibility";
import { useAuth } from "#/contexts/auth.context";
import {
  ApplicationRights,
  hasRights,
} from "#/models/authentication/user/rights";
import {
  uniteLegalePageDescription,
  uniteLegalePageTitle,
} from "#/utils/helpers/formatting/unite-legale-label";
import { meta } from "#/utils/seo";
import { HeaderDefaultError } from "../_header-default/-error";

export const Route = createFileRoute("/entreprise/$slug/documents")({
  shouldReload: true,
  loader: async ({ parentMatchPromise }) => {
    const { loaderData } = await parentMatchPromise;

    if (!loaderData) {
      throw notFound();
    }

    return loaderData;
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return meta.notFound();
    }

    const { uniteLegale } = loaderData;
    const canonical = `https://annuaire-entreprises.data.gouv.fr/entreprise/${uniteLegale.siren}/documents`;
    return {
      meta: meta({
        title: `Documents, Actes et statuts - ${uniteLegalePageTitle(uniteLegale)}`,
        description: uniteLegalePageDescription(uniteLegale),
        robots: "noindex",
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
  notFoundComponent: () => <NotFound withWrapper={false} />,
});

function RouteComponent() {
  const { uniteLegale } = Route.useLoaderData();
  const { user } = useAuth();

  return (
    <>
      <SummaryDocuments user={user} />
      <JustificatifsSection uniteLegale={uniteLegale} user={user} />
      <HorizontalSeparator />
      <BreakPageForPrint />
      <PrintNever>
        {hasRights({ user }, ApplicationRights.conformiteSociale) && (
          <ConformiteSocialeSection uniteLegale={uniteLegale} user={user} />
        )}
        {hasRights({ user }, ApplicationRights.conformiteFiscale) && (
          <ConformiteFiscaleSection uniteLegale={uniteLegale} user={user} />
        )}
        <ActesSection uniteLegale={uniteLegale} user={user} />
        {hasRights({ user }, ApplicationRights.travauxPublics) && (
          <TravauxPublicsSection uniteLegale={uniteLegale} user={user} />
        )}
      </PrintNever>
    </>
  );
}
