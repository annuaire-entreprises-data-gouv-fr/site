import { Metadata } from 'next';
import { cache } from 'react';
import { HorizontalSeparator } from '#components-ui/horizontal-separator';
import BreakPageForPrint from '#components-ui/print-break-page';
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
import UniteLegaleSection from '#components/unite-legale-section';
import UsefulShortcuts from '#components/useful-shortcuts';
import { isAPINotResponding } from '#models/api-not-responding';
import { getAssociation } from '#models/association';
import { estNonDiffusible } from '#models/core/statut-diffusion';
import { isAssociation, isCollectiviteTerritoriale } from '#models/core/types';
import { getUniteLegaleFromSlug } from '#models/core/unite-legale';
import { getServicePublicByUniteLegale } from '#models/service-public';
import {
  extractSirenOrSiretSlugFromUrl,
  shouldNotIndex,
  uniteLegalePageDescription,
  uniteLegalePageTitle,
} from '#utils/helpers';
import extractParamsAppRouter, {
  AppRouterProps,
} from '#utils/server-side-helper/app/extract-params';
import getSession from '#utils/server-side-helper/app/get-session';
import withErrorHandler from '#utils/server-side-helper/app/with-error-handler';
import { isSuperAgent } from '#utils/session';

const cachedGetUniteLegale = cache(
  async (slug: string, page: number, isBot: boolean) => {
    const sirenSlug = extractSirenOrSiretSlugFromUrl(slug);
    const uniteLegale = await getUniteLegaleFromSlug(sirenSlug, {
      page,
      isBot,
    });
    return uniteLegale;
  }
);

export const generateMetadata = withErrorHandler(
  async (props: AppRouterProps): Promise<Metadata> => {
    const { slug, page, isBot } = extractParamsAppRouter(props);
    const uniteLegale = await cachedGetUniteLegale(slug, page, isBot);
    return {
      title: uniteLegalePageTitle(uniteLegale, null),
      description: uniteLegalePageDescription(uniteLegale, null),
      robots: shouldNotIndex(uniteLegale)
        ? 'noindex, nofollow'
        : 'index, follow',
      alternates: {
        canonical: `https://annuaire-entreprises.data.gouv.fr/entreprise/${
          uniteLegale.chemin || uniteLegale.siren
        }`,
      },
    };
  }
);

export default withErrorHandler(async function UniteLegalePage(
  props: AppRouterProps
) {
  const session = await getSession();

  const { slug, page, isBot, isRedirected } = extractParamsAppRouter(props);
  const uniteLegale = await cachedGetUniteLegale(slug, page, isBot);

  const [association, servicePublic] = await Promise.all([
    getAssociation(uniteLegale, { isBot }),
    getServicePublicByUniteLegale(uniteLegale, {
      isBot,
    }),
  ]);

  return (
    <>
      {isRedirected && (
        <MatomoEventRedirected sirenOrSiret={uniteLegale.siren} />
      )}
      <StructuredDataBreadcrumb uniteLegale={uniteLegale} />
      <div className="content-container">
        <Title
          uniteLegale={uniteLegale}
          ficheType={FICHE.INFORMATION}
          session={session}
        />
        {estNonDiffusible(uniteLegale) ? (
          <NonDiffusibleSection />
        ) : (
          <>
            <UniteLegaleSection uniteLegale={uniteLegale} session={session} />
            {isSuperAgent(session) && (
              <EspaceAgentSummarySection
                uniteLegale={uniteLegale}
                session={session}
              />
            )}
            {isCollectiviteTerritoriale(uniteLegale) && (
              <CollectiviteTerritorialeSection uniteLegale={uniteLegale} />
            )}
            {servicePublic && (
              <ServicePublicSection
                uniteLegale={uniteLegale}
                servicePublic={servicePublic}
              />
            )}
            {(isCollectiviteTerritoriale(uniteLegale) ||
              (servicePublic && !isAPINotResponding(servicePublic))) && (
              <>
                <HorizontalSeparator />
                <BreakPageForPrint />
              </>
            )}
            {isAssociation(uniteLegale) && (
              <AssociationSection
                uniteLegale={uniteLegale}
                association={association}
              />
            )}
            <UsefulShortcuts uniteLegale={uniteLegale} />
            {uniteLegale.siege && (
              <EtablissementSection
                uniteLegale={uniteLegale}
                etablissement={uniteLegale.siege}
                usedInEntreprisePage={true}
                withDenomination={false}
                session={session}
              />
            )}
            <EtablissementListeSection
              uniteLegale={uniteLegale}
              session={session}
            />
          </>
        )}
      </div>
    </>
  );
});
