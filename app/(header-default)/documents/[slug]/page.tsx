import type { Metadata } from "next";
import Title from "#components/title-section";
import { FICHE } from "#components/title-section/tabs";
import { HorizontalSeparator } from "#components-ui/horizontal-separator";
import BreakPageForPrint from "#components-ui/print-break-page";
import { PrintNever } from "#components-ui/print-visibility";
import {
  ApplicationRights,
  hasRights,
} from "#models/authentication/user/rights";
import {
  uniteLegalePageDescription,
  uniteLegalePageTitle,
} from "#utils/helpers";
import { cachedGetUniteLegale } from "#utils/server-side-helper/cached-methods";
import extractParamsAppRouter, {
  type AppRouterProps,
} from "#utils/server-side-helper/extract-params";
import getSession from "#utils/server-side-helper/get-session";
import ActesSection from "./_components/actes";
import ConformiteSection from "./_components/conformite";
import JustificatifsSection from "./_components/justificatifs";
import { SummaryDocuments } from "./_components/summary-documents";
import TravauxPublicsSection from "./_components/travaux-publics";

export const generateMetadata = async (
  props: AppRouterProps
): Promise<Metadata> => {
  const { slug, isBot } = await extractParamsAppRouter(props);

  const uniteLegale = await cachedGetUniteLegale(slug, isBot);

  return {
    title: `Documents, Actes et statuts - ${uniteLegalePageTitle(uniteLegale)}`,
    description: uniteLegalePageDescription(uniteLegale),
    robots: "noindex",
    alternates: {
      canonical: `https://annuaire-entreprises.data.gouv.fr/documents/${uniteLegale.siren}`,
    },
  };
};

const UniteLegaleDocumentPage = async (props: AppRouterProps) => {
  const session = await getSession();
  const { slug, isBot } = await extractParamsAppRouter(props);
  const uniteLegale = await cachedGetUniteLegale(slug, isBot);

  return (
    <>
      <div className="content-container">
        <Title
          ficheType={FICHE.DOCUMENTS}
          session={session}
          uniteLegale={uniteLegale}
        />
        <SummaryDocuments session={session} />
        <JustificatifsSection session={session} uniteLegale={uniteLegale} />
        <HorizontalSeparator />
        <BreakPageForPrint />
        <PrintNever>
          {hasRights(session, ApplicationRights.conformite) && (
            <ConformiteSection session={session} uniteLegale={uniteLegale} />
          )}
          <ActesSection session={session} uniteLegale={uniteLegale} />
          {hasRights(session, ApplicationRights.travauxPublics) && (
            <TravauxPublicsSection
              session={session}
              uniteLegale={uniteLegale}
            />
          )}
        </PrintNever>
      </div>
    </>
  );
};

export default UniteLegaleDocumentPage;
