import { HorizontalSeparator } from '#components-ui/horizontal-separator';
import { DonneesPriveesSection } from '#components/donnees-privees-section';
import Title from '#components/title-section';
import { FICHE } from '#components/title-section/tabs';
import { estDiffusible } from '#models/core/diffusion';
import { isAssociation } from '#models/core/types';
import { ApplicationRights, hasRights } from '#models/user/rights';
import { uniteLegalePageTitle } from '#utils/helpers';
import { cachedGetUniteLegale } from '#utils/server-side-helper/app/cached-methods';
import extractParamsAppRouter, {
  AppRouterProps,
} from '#utils/server-side-helper/app/extract-params';
import getSession from '#utils/server-side-helper/app/get-session';
import { Metadata } from 'next';
import BilansSection from './_components/bilans-documents-societe';
import { FinancesSocieteBilansSection } from './_components/bilans-societe';
import ComptesBodacc from './_components/bodacc';
import { ComptesAssociationSection } from './_components/comptes-association';
import { FinancesAssociationSection } from './_components/finances-association';
import { FinancesSocieteSection } from './_components/finances-societe';
import { SubventionsAssociationSection } from './_components/subventions-association';

export const generateMetadata = async (
  props: AppRouterProps
): Promise<Metadata> => {
  const { slug, isBot } = await extractParamsAppRouter(props);

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
  const { slug, isBot } = await extractParamsAppRouter(props);
  const uniteLegale = await cachedGetUniteLegale(slug, isBot);
  const isMoreThanThreeYearsOld =
    new Date(uniteLegale.dateDebutActivite).getFullYear() + 3 <=
    new Date().getFullYear();

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
            <ComptesAssociationSection uniteLegale={uniteLegale} />
          </>
        ) : (
          <>
            {estDiffusible(uniteLegale) ||
            hasRights(session, ApplicationRights.nonDiffusible) ? (
              <>
                <FinancesSocieteSection
                  uniteLegale={uniteLegale}
                  session={session}
                />
                {hasRights(session, ApplicationRights.bilans) &&
                  isMoreThanThreeYearsOld && (
                    <FinancesSocieteBilansSection
                      uniteLegale={uniteLegale}
                      session={session}
                    />
                  )}
              </>
            ) : (
              <DonneesPriveesSection title="Indicateurs financiers" />
            )}
            <HorizontalSeparator />
            <BilansSection uniteLegale={uniteLegale} session={session} />
            <ComptesBodacc uniteLegale={uniteLegale} />
          </>
        )}
      </div>
    </>
  );
};

export default FinancePage;
