import { Metadata } from 'next';
import { HorizontalSeparator } from '#components-ui/horizontal-separator';
import ComptesBodacc from '#components/annonces-section/comptes/bodacc';
import { ComptesAssociationSection } from '#components/annonces-section/comptes/dca';
import DocumentBilansSection from '#components/espace-agent-components/documents/bilans-walled';
import { FinancesSocieteSection } from '#components/finances-section/societe';
import Title from '#components/title-section';
import { FICHE } from '#components/title-section/tabs';
import { isAssociation } from '#models/core/types';
import { uniteLegalePageTitle } from '#utils/helpers';
import extractParamsAppRouter, {
  AppRouterProps,
} from '#utils/server-side-helper/app/extract-params';
import getSession from '#utils/server-side-helper/app/get-session';
import { cachedGetUniteLegale } from 'app/(header-default)/cached-methods';

export const generateMetadata = async (
  props: AppRouterProps
): Promise<Metadata> => {
  const { slug, isBot } = extractParamsAppRouter(props);

  const uniteLegale = await cachedGetUniteLegale(slug, isBot);
  const session = await getSession();

  return {
    robots: 'noindex, nofollow',
    title: `Données financières - ${uniteLegalePageTitle(
      uniteLegale,
      session
    )}`,
    alternates: {
      canonical: `https://annuaire-entreprises.data.gouv.fr/donnees-financieres/${uniteLegale.siren}`,
    },
  };
};

const FinancePage = async (props: AppRouterProps) => {
  const session = await getSession();
  const { slug, isBot } = extractParamsAppRouter(props);
  const uniteLegale = await cachedGetUniteLegale(slug, isBot);

  return (
    <>
      <div className="content-container">
        <Title
          ficheType={FICHE.FINANCES}
          uniteLegale={uniteLegale}
          session={session}
        />
        {/* We use to have finances for association but data disappeared from open data API. Code still exists in <FinancesAssociationSection /> */}
        {isAssociation(uniteLegale) ? null : (
          <>
            <FinancesSocieteSection uniteLegale={uniteLegale} />
            <HorizontalSeparator />
            <DocumentBilansSection
              uniteLegale={uniteLegale}
              session={session}
            />
          </>
        )}
        {isAssociation(uniteLegale) ? (
          <ComptesAssociationSection uniteLegale={uniteLegale} />
        ) : (
          <ComptesBodacc uniteLegale={uniteLegale} />
        )}
      </div>
    </>
  );
};

export default FinancePage;
