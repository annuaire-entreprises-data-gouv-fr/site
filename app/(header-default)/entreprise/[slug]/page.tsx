import { HorizontalSeparator } from "#components-ui/horizontal-separator";
import AssociationSection from "#components/association-section";
import CollectiviteTerritorialeSection from "#components/collectivite-territoriale-section";
import { EspaceAgentSummarySection } from "#components/espace-agent-components/summary-section";
import EtablissementListeSection from "#components/etablissement-liste-section";
import EtablissementSection from "#components/etablissement-section";
import MatomoEventRedirected from "#components/matomo-event/search-redirected";
import { NonDiffusibleStrictSection } from "#components/non-diffusible-section";
import ServicePublicSection from "#components/service-public-section";
import StructuredDataBreadcrumb from "#components/structured-data/breadcrumb";
import Title from "#components/title-section";
import { FICHE } from "#components/title-section/tabs";
import {
  ApplicationRights,
  hasRights,
} from "#models/authentication/user/rights";
import { estNonDiffusibleStrict } from "#models/core/diffusion";
import {
  isAssociation,
  isCollectiviteTerritoriale,
  isServicePublic,
} from "#models/core/types";
import { getRechercheEntrepriseSourcesLastModified } from "#models/recherche-entreprise-modified";
import {
  extractSirenOrSiretSlugFromUrl,
  shouldNotIndex,
  uniteLegalePageDescription,
  uniteLegalePageTitle,
} from "#utils/helpers";
import { cachedGetUniteLegale } from "#utils/server-side-helper/app/cached-methods";
import extractParamsAppRouter, {
  type AppRouterProps,
} from "#utils/server-side-helper/app/extract-params";
import getSession from "#utils/server-side-helper/app/get-session";
import { UniteLegaleImmatriculationSection } from "app/(header-default)/entreprise/[slug]/_components/immatriculation-section";
import UniteLegaleSummarySection from "app/(header-default)/entreprise/[slug]/_components/summary-section";
import type { Metadata } from "next";
import { permanentRedirect } from "next/navigation";

export const generateMetadata = async (
  props: AppRouterProps
): Promise<Metadata> => {
  const { slug, page, isBot } = await extractParamsAppRouter(props);

  const uniteLegale = await cachedGetUniteLegale(slug, isBot, page);
  return {
    title: uniteLegalePageTitle(uniteLegale),
    description: uniteLegalePageDescription(uniteLegale),
    robots: shouldNotIndex(uniteLegale) ? "noindex, nofollow" : "index, follow",
    ...(uniteLegale.chemin && {
      alternates: {
        canonical: `https://annuaire-entreprises.data.gouv.fr/entreprise/${uniteLegale.chemin}`,
      },
    }),
  };
};

export default async function UniteLegalePage(props: AppRouterProps) {
  const { slug, page, isBot, isRedirected } =
    await extractParamsAppRouter(props);
  const session = await getSession();
  const [uniteLegale, sourcesLastModified] = await Promise.all([
    cachedGetUniteLegale(slug, isBot, page),
    getRechercheEntrepriseSourcesLastModified(),
  ]);

  const extractedSiren = extractSirenOrSiretSlugFromUrl(slug);
  // We redirect from /entreprise/${siren} to /entreprise/${slug}
  // Nb: in somes cases, there can be a two redirects :
  // /rechercher?terme=${siren} -> /entreprise/${siren}?redirected=1 -> /entreprise/${slug}?redirected=1
  if (
    slug === extractedSiren &&
    uniteLegale.chemin &&
    uniteLegale.chemin !== uniteLegale.siren
  ) {
    const searchParams = await props.searchParams;
    const queryString = new URLSearchParams(
      searchParams as Record<string, string>
    ).toString();
    permanentRedirect(
      `/entreprise/${uniteLegale.chemin}${queryString ? `?${queryString}` : ""}`
    );
  }

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
          <NonDiffusibleStrictSection />
        ) : (
          <>
            <UniteLegaleSummarySection
              uniteLegale={uniteLegale}
              session={session}
            />
            {hasRights(session, ApplicationRights.isAgent) && (
              <EspaceAgentSummarySection
                uniteLegale={uniteLegale}
                session={session}
              />
            )}
            {uniteLegale.dateMiseAJourInpi && (
              <UniteLegaleImmatriculationSection
                uniteLegale={uniteLegale}
                rneLastModified={sourcesLastModified.rne}
                session={session}
              />
            )}
            {isCollectiviteTerritoriale(uniteLegale) && (
              <CollectiviteTerritorialeSection uniteLegale={uniteLegale} />
            )}
            {isServicePublic(uniteLegale) && (
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
