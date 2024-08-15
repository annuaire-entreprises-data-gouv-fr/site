import { HorizontalSeparator } from '#components-ui/horizontal-separator';
import AssociationSection from '#components/association-section';
import CollectiviteTerritorialeSection from '#components/collectivite-territoriale-section';
import { EspaceAgentSummarySection } from '#components/espace-agent-components/summary-section';
import EtablissementListeSection from '#components/etablissement-liste-section';
import EtablissementSection from '#components/etablissement-section';
import MatomoEventRedirected from '#components/matomo-event/search-redirected';
import { NonDiffusibleSection } from '#components/non-diffusible-section';
import ServicePublicSection from '#components/service-public-section';
import StructuredDataBreadcrumb from '#components/structured-data/breadcrumb';
import Title from '#components/title-section';
import { FICHE } from '#components/title-section/tabs';
import { UniteLegaleImmatriculationSection } from '#components/unite-legale-immatriculation-section';
import UniteLegaleSection from '#components/unite-legale-section';
import { estNonDiffusibleStrict } from '#models/core/diffusion';
import {
  isAssociation,
  isCollectiviteTerritoriale,
  isServicePublic,
} from '#models/core/types';
import { EScope, hasRights } from '#models/user/rights';
import {
  shouldNotIndex,
  uniteLegalePageDescription,
  uniteLegalePageTitle,
} from '#utils/helpers';
import { cachedGetUniteLegale } from '#utils/server-side-helper/app/cached-methods';
import extractParamsAppRouter, {
  AppRouterProps,
} from '#utils/server-side-helper/app/extract-params';
import getSession from '#utils/server-side-helper/app/get-session';
import { Metadata } from 'next';

export const generateMetadata = async (
  props: AppRouterProps
): Promise<Metadata> => {
  const { slug, page, isBot } = extractParamsAppRouter(props);

  const uniteLegale = await cachedGetUniteLegale(slug, isBot, page);
  return {
    title: uniteLegalePageTitle(uniteLegale),
    description: uniteLegalePageDescription(uniteLegale),
    robots: shouldNotIndex(uniteLegale) ? 'noindex, nofollow' : 'index, follow',
    alternates: {
      canonical: `https://annuaire-entreprises.data.gouv.fr/entreprise/${
        uniteLegale.chemin || uniteLegale.siren
      }`,
    },
  };
};

export default async function UniteLegalePage(props: AppRouterProps) {
  const { slug, page, isBot, isRedirected } = extractParamsAppRouter(props);
  const session = await getSession();
  const uniteLegale = await cachedGetUniteLegale(slug, isBot, page);

  return (
    <>
      {isRedirected && (
        <MatomoEventRedirected sirenOrSiret={uniteLegale.siren} />
      )}
      <div className="content-container">
        <Title
          uniteLegale={uniteLegale}
          ficheType={FICHE.INFORMATION}
          session={session}
        />
        {estNonDiffusibleStrict(uniteLegale) ? (
          <NonDiffusibleSection />
        ) : (
          <>
            <UniteLegaleSection uniteLegale={uniteLegale} session={session} />
            {hasRights(session, EScope.isAgent) && (
              <EspaceAgentSummarySection
                uniteLegale={uniteLegale}
                session={session}
              />
            )}
            {uniteLegale.immatriculation && (
              <UniteLegaleImmatriculationSection uniteLegale={uniteLegale} />
            )}
            {isCollectiviteTerritoriale(uniteLegale) && (
              <CollectiviteTerritorialeSection uniteLegale={uniteLegale} />
            )}
            {isServicePublic(uniteLegale) &&
              !isCollectiviteTerritoriale(uniteLegale) && (
                <ServicePublicSection uniteLegale={uniteLegale} />
              )}
            {!isBot && isAssociation(uniteLegale) && (
              <AssociationSection uniteLegale={uniteLegale} session={session} />
            )}
            <HorizontalSeparator />
            {uniteLegale.siege && (
              <EtablissementSection
                uniteLegale={uniteLegale}
                etablissement={uniteLegale.siege}
                usedInEntreprisePage={true}
                withDenomination={false}
                session={session}
              />
            )}
            <EtablissementListeSection uniteLegale={uniteLegale} />
          </>
        )}
      </div>
      <StructuredDataBreadcrumb uniteLegale={uniteLegale} />
    </>
  );
}
