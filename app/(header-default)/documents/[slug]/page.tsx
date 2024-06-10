import { Metadata } from 'next';
import { PrintNever } from '#components-ui/print-visibility';
import AgentWallDocuments from '#components/espace-agent-components/agent-wall/document';
import ConformiteSection from '#components/espace-agent-components/conformite-section';
import Title from '#components/title-section';
import { FICHE } from '#components/title-section/tabs';
import { EScope, hasRights } from '#models/user/rights';
import {
  uniteLegalePageDescription,
  uniteLegalePageTitle,
} from '#utils/helpers';
import { cachedGetUniteLegale } from '#utils/server-side-helper/app/cached-methods';
import extractParamsAppRouter, {
  AppRouterProps,
} from '#utils/server-side-helper/app/extract-params';
import getSession from '#utils/server-side-helper/app/get-session';
import AgentActesSection from './_components/actes-section';
import CarteProfessionnelleTPSection from './_components/carte-professionnelle-TP-section';

export const generateMetadata = async (
  props: AppRouterProps
): Promise<Metadata> => {
  const { slug, isBot } = extractParamsAppRouter(props);

  const uniteLegale = await cachedGetUniteLegale(slug, isBot);
  const session = await getSession();

  return {
    title: `Documents, Actes et statuts - ${uniteLegalePageTitle(
      uniteLegale,
      session
    )}`,
    description: uniteLegalePageDescription(uniteLegale, session),
    robots: 'noindex',
    alternates: {
      canonical: `https://annuaire-entreprises.data.gouv.fr/documents/${
        uniteLegale.chemin || uniteLegale.siren
      }`,
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
        <PrintNever>
          {hasRights(session, EScope.conformite) && (
            <ConformiteSection uniteLegale={uniteLegale} />
          )}
          {!hasRights(session, EScope.documentsRne) ? (
            <AgentWallDocuments
              title="Actes et statuts"
              id="actes"
              uniteLegale={uniteLegale}
            />
          ) : (
            <AgentActesSection uniteLegale={uniteLegale} />
          )}
          {hasRights(session, EScope.carteProfessionnelleTravauxPublics) && (
            <CarteProfessionnelleTPSection uniteLegale={uniteLegale} />
          )}
        </PrintNever>
      </div>
    </>
  );
};

export default UniteLegaleDocumentPage;
