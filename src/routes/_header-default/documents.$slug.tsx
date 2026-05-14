import { createFileRoute } from "@tanstack/react-router";
import ActesSection from "#/components/screens/documents.$slug/actes";
import {
  ConformiteFiscaleSection,
  ConformiteSocialeSection,
} from "#/components/screens/documents.$slug/conformite";
import JustificatifsSection from "#/components/screens/documents.$slug/justificatifs";
import { SummaryDocuments } from "#/components/screens/documents.$slug/summary-documents";
import TravauxPublicsSection from "#/components/screens/documents.$slug/travaux-publics";
import Title from "#/components/title-section";
import { FICHE } from "#/components/title-section/tabs";
import { HorizontalSeparator } from "#/components-ui/horizontal-separator";
import BreakPageForPrint from "#/components-ui/print-break-page";
import { PrintNever } from "#/components-ui/print-visibility";
import { useAuth } from "#/contexts/auth.context";
import {
  ApplicationRights,
  hasRights,
} from "#/models/authentication/user/rights";
import { meta } from "#/seo";
import { getUniteLegaleFromSlugFn } from "#/server-functions/public/unite-legale";
import {
  uniteLegalePageDescription,
  uniteLegalePageTitle,
} from "#/utils/helpers/formatting/unite-legale-label";
import { HeaderDefaultError } from "./-error";

export const Route = createFileRoute("/_header-default/documents/$slug")({
  loader: async ({ params }) => {
    const uniteLegale = await getUniteLegaleFromSlugFn({
      data: { slug: params.slug },
    });

    return { uniteLegale };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return {
        meta: meta({
          title: "Page non trouvée",
          robots: {
            follow: false,
          },
        }),
      };
    }

    const { uniteLegale } = loaderData;
    const canonical = `https://annuaire-entreprises.data.gouv.fr/documents/${uniteLegale.siren}`;
    return {
      meta: meta({
        title: `Documents, Actes et statuts - ${uniteLegalePageTitle(uniteLegale)}`,
        description: uniteLegalePageDescription(uniteLegale),
        robots: {
          follow: true,
          index: false,
        },
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
  const { uniteLegale } = Route.useLoaderData();
  const { user } = useAuth();

  return (
    <div className="content-container">
      <Title
        ficheType={FICHE.DOCUMENTS}
        uniteLegale={uniteLegale}
        user={user}
      />
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
    </div>
  );
}
