import { Metadata } from 'next';
import { HorizontalSeparator } from '#components-ui/horizontal-separator';
import BreakPageForPrint from '#components-ui/print-break-page';
import { PrintNever } from '#components-ui/print-visibility';
import ConformiteSection from '#components/espace-agent-components/conformite-section';
import Title from '#components/title-section';
import { FICHE } from '#components/title-section/tabs';
import { AppScope, hasRights } from '#models/user/rights';
import {
  uniteLegalePageDescription,
  uniteLegalePageTitle,
} from '#utils/helpers';
import { cachedGetUniteLegale } from '#utils/server-side-helper/app/cached-methods';
import extractParamsAppRouter, {
  AppRouterProps,
} from '#utils/server-side-helper/app/extract-params';
import getSession from '#utils/server-side-helper/app/get-session';
import ActesSection from './_components/actes';
import CarteProfessionnelleTPSection from './_components/carte-professionnelle-TP-section';
import JustificatifsSection from './_components/justificatifs';
import { SummaryDocuments } from './_components/summary-documents';

export const generateMetadata = async (
  props: AppRouterProps
): Promise<Metadata> => {
  const { slug, isBot } = extractParamsAppRouter(props);

  const uniteLegale = await cachedGetUniteLegale(slug, isBot);

  return {
    title: `Documents, Actes et statuts - ${uniteLegalePageTitle(uniteLegale)}`,
    description: uniteLegalePageDescription(uniteLegale),
    robots: 'noindex',
    alternates: {
      canonical: `https://annuaire-entreprises.data.gouv.fr/documents/${uniteLegale.siren}`,
    },
  };
};

const UniteLegaleDocumentPage = async (props: AppRouterProps) => {
  const session = await getSession();
  const { slug, isBot } = extractParamsAppRouter(props);
  const uniteLegale = await cachedGetUniteLegale(slug, isBot);

  return (
    <>
      <div className="content-container">
        <Title
          uniteLegale={uniteLegale}
          ficheType={FICHE.DOCUMENTS}
          session={session}
        />
        <SummaryDocuments session={session} />
        <JustificatifsSection uniteLegale={uniteLegale} session={session} />
        <HorizontalSeparator />
        <BreakPageForPrint />
        <PrintNever>
          {hasRights(session, AppScope.conformite) && (
            <ConformiteSection session={session} uniteLegale={uniteLegale} />
          )}
          <ActesSection uniteLegale={uniteLegale} session={session} />
          {hasRights(session, AppScope.carteProfessionnelleTravauxPublics) && (
            <CarteProfessionnelleTPSection
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
