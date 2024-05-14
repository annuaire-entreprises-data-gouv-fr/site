import { Metadata } from 'next';
import { HorizontalSeparator } from '#components-ui/horizontal-separator';
import { CarteProfessionnelleTravauxPublicsSection } from '#components/carte-professionnelle-travaux-publics-section';
import ConformiteSection from '#components/espace-agent-components/conformite-section';
import ActesSection from '#components/espace-agent-components/documents/actes-walled';
import Title from '#components/title-section';
import { FICHE } from '#components/title-section/tabs';
import { isAPI404 } from '#models/api-not-responding';
import { getCarteProfessionnelleTravauxPublic } from '#models/espace-agent/carte-professionnelle-travaux-publics';
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
    robots: 'noindex, nofollow',
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

  const carteProfessionnelleTravauxPublics = hasRights(
    session,
    EScope.carteProfessionnelleTravauxPublics
  )
    ? await getCarteProfessionnelleTravauxPublic(
        uniteLegale.siren,
        session?.user
      )
    : null;
  return (
    <>
      <div className="content-container">
        <Title
          uniteLegale={uniteLegale}
          ficheType={FICHE.DOCUMENTS}
          session={session}
        />
        {hasRights(session, EScope.conformite) && (
          <>
            <ConformiteSection uniteLegale={uniteLegale} session={session} />
            <HorizontalSeparator />
          </>
        )}
        <ActesSection uniteLegale={uniteLegale} session={session} />
        {carteProfessionnelleTravauxPublics &&
          !isAPI404(carteProfessionnelleTravauxPublics) && (
            <CarteProfessionnelleTravauxPublicsSection
              carteProfessionnelleTravauxPublics={
                carteProfessionnelleTravauxPublics
              }
            />
          )}
      </div>
    </>
  );
};

export default UniteLegaleDocumentPage;
