import { HorizontalSeparator } from '#components-ui/horizontal-separator';
import { FinancesAssociationSection } from '#components/finances-section/association';
import { FinancesSocieteSection } from '#components/finances-section/societe';
import { SubventionsAssociationSection } from '#components/subventions-association-section';
import Title from '#components/title-section';
import { FICHE } from '#components/title-section/tabs';
import { isAssociation } from '#models/core/types';
import { uniteLegalePageTitle } from '#utils/helpers';
import { cachedGetUniteLegale } from '#utils/server-side-helper/app/cached-methods';
import extractParamsAppRouter, {
  AppRouterProps,
} from '#utils/server-side-helper/app/extract-params';
import getSession from '#utils/server-side-helper/app/get-session';
import ComptesBodacc from 'app/(header-default)/donnees-financieres/[slug]/_components/bodacc';
import { ComptesAssociationSection } from 'app/(header-default)/donnees-financieres/[slug]/_components/dca';
import { Metadata } from 'next';
import BilansSection from './_components';

export const generateMetadata = async (
  props: AppRouterProps
): Promise<Metadata> => {
  const { slug, isBot } = extractParamsAppRouter(props);

  const uniteLegale = await cachedGetUniteLegale(slug, isBot);

  return {
    robots: 'noindex',
    title: `Données financières - ${uniteLegalePageTitle(uniteLegale)}`,
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
        {isAssociation(uniteLegale) ? (
          <>
            <FinancesAssociationSection
              session={session}
              uniteLegale={uniteLegale}
            />
            <SubventionsAssociationSection
              session={session}
              uniteLegale={uniteLegale}
            />
          </>
        ) : (
          <>
            <FinancesSocieteSection uniteLegale={uniteLegale} />
            <HorizontalSeparator />
            <BilansSection uniteLegale={uniteLegale} session={session} />
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
