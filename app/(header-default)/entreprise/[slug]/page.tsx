import { UniteLegaleImmatriculationSection } from "app/(header-default)/entreprise/[slug]/_components/immatriculation-section";
import UniteLegaleSummarySection from "app/(header-default)/entreprise/[slug]/_components/summary-section";
import type { Metadata } from "next";
import { permanentRedirect } from "next/navigation";
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
import { HorizontalSeparator } from "#components-ui/horizontal-separator";
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
  shouldNotIndex,
  uniteLegalePageDescription,
  uniteLegalePageTitle,
} from "#utils/helpers";
import { cachedGetUniteLegale } from "#utils/server-side-helper/cached-methods";
import extractParamsAppRouter, {
  type AppRouterProps,
} from "#utils/server-side-helper/extract-params";
import getSession from "#utils/server-side-helper/get-session";

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

  // We redirect from /entreprise/${siren} to /entreprise/${chemin}
  // Nb: in somes cases, there can be a two redirects :
  // /rechercher?terme=${siren} -> /entreprise/${siren}?redirected=1 -> /entreprise/${chemin}?redirected=1
  if (
    uniteLegale.chemin &&
    uniteLegale.chemin !== slug &&
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
          ficheType={FICHE.INFORMATION}
          session={session}
          uniteLegale={uniteLegale}
        />
        {estNonDiffusibleStrict(uniteLegale) ? (
          <NonDiffusibleStrictSection />
        ) : (
          <>
            <UniteLegaleSummarySection
              session={session}
              uniteLegale={uniteLegale}
            />
            {hasRights(session, ApplicationRights.isAgent) && (
              <EspaceAgentSummarySection
                session={session}
                uniteLegale={uniteLegale}
              />
            )}
            {uniteLegale.dateMiseAJourInpi && (
              <UniteLegaleImmatriculationSection
                rneLastModified={sourcesLastModified.rne}
                session={session}
                uniteLegale={uniteLegale}
              />
            )}
            {isCollectiviteTerritoriale(uniteLegale) && (
              <CollectiviteTerritorialeSection uniteLegale={uniteLegale} />
            )}
            {isServicePublic(uniteLegale) && (
              <ServicePublicSection uniteLegale={uniteLegale} />
            )}
            {!isBot && isAssociation(uniteLegale) && (
              <AssociationSection session={session} uniteLegale={uniteLegale} />
            )}
            <HorizontalSeparator />
            {uniteLegale.siege && (
              <EtablissementSection
                etablissement={uniteLegale.siege}
                session={session}
                uniteLegale={uniteLegale}
                usedInEntreprisePage={true}
                withDenomination={false}
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
