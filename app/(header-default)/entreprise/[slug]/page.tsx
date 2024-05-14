import { Metadata } from 'next';
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
import { estNonDiffusible } from '#models/core/statut-diffusion';
import { isAssociation, isCollectiviteTerritoriale } from '#models/core/types';
import { getProtectedCertificats } from '#models/espace-agent/certificats';
import { getImmatriculationEORI } from '#models/espace-agent/immatriculation-eori';
import { getServicePublicByUniteLegale } from '#models/service-public';
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

export const generateMetadata = async (
  props: AppRouterProps
): Promise<Metadata> => {
  const { slug, page, isBot } = extractParamsAppRouter(props);

  const uniteLegale = await cachedGetUniteLegale(slug, isBot, page);
  const session = await getSession();
  return {
    title: uniteLegalePageTitle(uniteLegale, session),
    description: uniteLegalePageDescription(uniteLegale, session),
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

  const [servicePublic, immatriculationEORI, privateCertificats] =
    await Promise.all([
      getServicePublicByUniteLegale(uniteLegale, {
        isBot,
      }),
      hasRights(session, EScope.eori)
        ? getImmatriculationEORI(uniteLegale.siege.siret, session?.user)
        : null,
      hasRights(session, EScope.protectedCertificats)
        ? getProtectedCertificats(uniteLegale, session?.user)
        : null,
    ]);

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
        {estNonDiffusible(uniteLegale) ? (
          <NonDiffusibleSection />
        ) : (
          <>
            <UniteLegaleSection
              uniteLegale={uniteLegale}
              session={session}
              protectedCertificats={privateCertificats}
            />
            {hasRights(session, EScope.isAgent) && (
              <EspaceAgentSummarySection
                immatriculationEORI={immatriculationEORI}
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
              <AssociationSection uniteLegale={uniteLegale} session={session} />
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
      <StructuredDataBreadcrumb uniteLegale={uniteLegale} />
    </>
  );
}
