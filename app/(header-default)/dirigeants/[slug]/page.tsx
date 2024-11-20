import { HorizontalSeparator } from '#components-ui/horizontal-separator';
import BreakPageForPrint from '#components-ui/print-break-page';
import { DonneesPriveesSection } from '#components/donnees-privees-section';
import Title from '#components/title-section';
import { FICHE } from '#components/title-section/tabs';
import { estDiffusible } from '#models/core/diffusion';
import { isAssociation, isServicePublic } from '#models/core/types';
import { ApplicationRights, hasRights } from '#models/user/rights';
import {
  uniteLegalePageDescription,
  uniteLegalePageTitle,
} from '#utils/helpers';
import { cachedGetUniteLegale } from '#utils/server-side-helper/app/cached-methods';
import extractParamsAppRouter, {
  AppRouterProps,
} from '#utils/server-side-helper/app/extract-params';
import getSession from '#utils/server-side-helper/app/get-session';
import { Metadata } from 'next';
import DirigeantsAssociationSection from './_component/sections/association/dirigeants';
import BeneficiairesSection from './_component/sections/entreprise/beneficiaires';
import DirigeantsSection from './_component/sections/entreprise/dirigeants-open/section';
import DirigeantsSectionProtected from './_component/sections/entreprise/dirigeants-protected/section';
import DirigeantSummary from './_component/sections/entreprise/summary';
import ResponsablesServicePublicSection from './_component/sections/service-public';

export const generateMetadata = async (
  props: AppRouterProps
): Promise<Metadata> => {
  const { slug, page, isBot } = await extractParamsAppRouter(props);

  const uniteLegale = await cachedGetUniteLegale(slug, isBot, page);

  return {
    title: `Dirigeants de la structure - ${uniteLegalePageTitle(uniteLegale)}`,
    description: uniteLegalePageDescription(uniteLegale),
    robots: 'noindex',
    alternates: {
      canonical: `https://annuaire-entreprises.data.gouv.fr/dirigeants/${uniteLegale.siren}`,
    },
  };
};

const DirigeantsPage = async (props: AppRouterProps) => {
  const { slug, isBot } = await extractParamsAppRouter(props);

  const uniteLegale = await cachedGetUniteLegale(slug, isBot);

  const session = await getSession();
  const isProtected = hasRights(session, ApplicationRights.mandatairesRCS);

  return (
    <>
      <div className="content-container">
        <Title
          uniteLegale={uniteLegale}
          ficheType={FICHE.DIRIGEANTS}
          session={session}
        />
        <DirigeantSummary uniteLegale={uniteLegale} />
        {isServicePublic(uniteLegale) ? (
          <ResponsablesServicePublicSection uniteLegale={uniteLegale} />
        ) : !estDiffusible(uniteLegale) &&
          !hasRights(session, ApplicationRights.nonDiffusible) ? (
          <DonneesPriveesSection />
        ) : isAssociation(uniteLegale) ? (
          <DirigeantsAssociationSection
            uniteLegale={uniteLegale}
            session={session}
          />
        ) : (
          <>
            {isProtected ? (
              <DirigeantsSectionProtected
                uniteLegale={uniteLegale}
                session={session}
              />
            ) : (
              <DirigeantsSection uniteLegale={uniteLegale} session={session} />
            )}
            <BreakPageForPrint />
            <HorizontalSeparator />
            <BeneficiairesSection uniteLegale={uniteLegale} session={session} />
          </>
        )}
      </div>
    </>
  );
};

export default DirigeantsPage;
