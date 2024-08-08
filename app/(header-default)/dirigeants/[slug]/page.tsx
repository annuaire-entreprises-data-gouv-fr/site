import { Metadata } from 'next';
import { DonneesPriveesSection } from '#components/donnees-privees-section';
import Title from '#components/title-section';
import { FICHE } from '#components/title-section/tabs';
import { estDiffusible } from '#models/core/diffusion';
import { isAssociation, isServicePublic } from '#models/core/types';
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
import DirigeantsAssociationSection from './_component/sections/association/dirigeants';
import { DirigeantInformation } from './_component/sections/entreprise';
import ResponsablesServicePublicSection from './_component/sections/service-public';

export const generateMetadata = async (
  props: AppRouterProps
): Promise<Metadata> => {
  const { slug, page, isBot } = extractParamsAppRouter(props);

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
  const { slug, isBot } = extractParamsAppRouter(props);

  const uniteLegale = await cachedGetUniteLegale(slug, isBot);

  const session = await getSession();

  return (
    <>
      <div className="content-container">
        <Title
          uniteLegale={uniteLegale}
          ficheType={FICHE.DIRIGEANTS}
          session={session}
        />
        {isServicePublic(uniteLegale) ? (
          <ResponsablesServicePublicSection uniteLegale={uniteLegale} />
        ) : !estDiffusible(uniteLegale) &&
          !hasRights(session, EScope.nonDiffusible) ? (
          <DonneesPriveesSection />
        ) : isAssociation(uniteLegale) ? (
          <DirigeantsAssociationSection
            uniteLegale={uniteLegale}
            session={session}
          />
        ) : (
          <DirigeantInformation uniteLegale={uniteLegale} session={session} />
        )}
      </div>
    </>
  );
};

export default DirigeantsPage;
