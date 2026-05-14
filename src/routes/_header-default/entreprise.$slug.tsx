import {
  createFileRoute,
  notFound,
  redirect,
  stripSearchParams,
} from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { getRequestHeader } from "@tanstack/react-start/server";
import z from "zod";
import AssociationSection from "#/components/association-section";
import CollectiviteTerritorialeSection from "#/components/collectivite-territoriale-section";
import EspaceAgentSummarySection from "#/components/espace-agent-components/summary-section";
import EtablissementListeSection from "#/components/etablissement-liste-section";
import EtablissementSection from "#/components/etablissement-section";
import MatomoEventFromRedirected from "#/components/matomo-event/search-redirected";
import { NonDiffusibleStrictSection } from "#/components/non-diffusible-section";
import AvocatsSection from "#/components/screens/entreprise.$slug/avocats-section";
import { UniteLegaleImmatriculationSection } from "#/components/screens/entreprise.$slug/immatriculation-section";
import UniteLegaleSummarySection from "#/components/screens/entreprise.$slug/summary-section";
import ServicePublicSection from "#/components/service-public-section";
import StructuredDataBreadcrumb from "#/components/structured-data/breadcrumb";
import Title from "#/components/title-section";
import { FICHE } from "#/components/title-section/tabs";
import { HorizontalSeparator } from "#/components-ui/horizontal-separator";
import { useAuth } from "#/contexts/auth.context";
import {
  ApplicationRights,
  hasRights,
} from "#/models/authentication/user/rights";
import { estNonDiffusibleStrict } from "#/models/core/diffusion";
import {
  isAssociation,
  isAvocat,
  isCollectiviteTerritoriale,
  isServicePublic,
} from "#/models/core/types";
import { getRechercheEntrepriseSourcesLastModified } from "#/models/recherche-entreprise-modified";
import { meta } from "#/seo";
import { getUniteLegaleFromSlugFn } from "#/server-functions/public/unite-legale";
import {
  extractSirenOrSiretSlugFromUrl,
  isLikelyASiren,
  isLikelyASiret,
  shouldNotIndex,
  uniteLegalePageDescription,
  uniteLegalePageTitle,
} from "#/utils/helpers";
import { getBaseUrl } from "#/utils/server-side-helper/get-base-url";
import isUserAgentABot from "#/utils/user-agent";
import { HeaderDefaultError } from "./-error";

const loadEntreprisePage = createServerFn()
  .inputValidator(z.object({ slug: z.string(), isRedirected: z.boolean() }))
  .handler(async ({ data: { slug, isRedirected } }) => {
    const [uniteLegale, sourcesLastModified] = await Promise.all([
      getUniteLegaleFromSlugFn({
        data: { slug },
      }),
      getRechercheEntrepriseSourcesLastModified(),
    ]);

    if (
      uniteLegale.chemin &&
      uniteLegale.chemin !== slug &&
      uniteLegale.chemin !== uniteLegale.siren
    ) {
      throw redirect({
        to: "/entreprise/$slug",
        params: { slug: uniteLegale.chemin },
        search: {
          redirected: isRedirected ? 1 : undefined,
        },
        statusCode: 308,
      });
    }

    const isFromSite = isRedirected
      ? (getRequestHeader("referer") || "").startsWith(getBaseUrl())
      : false;

    const triggerRedirectedEvent = isFromSite && isRedirected;

    const userAgent = getRequestHeader("user-agent") || "";
    const isBot = isUserAgentABot(userAgent);

    return { uniteLegale, triggerRedirectedEvent, isBot, sourcesLastModified };
  });

export const Route = createFileRoute("/_header-default/entreprise/$slug")({
  validateSearch: z.object({
    redirected: z.literal(1).optional().catch(undefined),
    "avocats-page": z.number().min(1).optional().default(1).catch(1),
  }),
  search: {
    middlewares: [stripSearchParams({ "avocats-page": 1 })],
  },
  beforeLoad: async ({ params }) => {
    const slug = params.slug;
    const sirenOrSiretSlug = extractSirenOrSiretSlugFromUrl(slug);

    if (isLikelyASiret(sirenOrSiretSlug)) {
      throw redirect({
        to: "/etablissement/$slug",
        params: { slug: sirenOrSiretSlug },
      });
    }
    if (!isLikelyASiren(sirenOrSiretSlug)) {
      throw notFound();
    }
  },
  loaderDeps: ({ search }) => ({ redirected: search.redirected }),
  loader: async ({ params, deps }) =>
    await loadEntreprisePage({
      data: { slug: params.slug, isRedirected: deps.redirected === 1 },
    }),
  head: ({ loaderData }) => {
    if (!loaderData) {
      return {
        meta: meta({
          title: "Page non trouvée",
          robots: {
            follow: false,
          },
        }),
      };
    }

    const { uniteLegale } = loaderData;
    const canonical = `https://annuaire-entreprises.data.gouv.fr/entreprise/${uniteLegale.siren}`;
    return {
      meta: meta({
        title: uniteLegalePageTitle(uniteLegale),
        description: uniteLegalePageDescription(uniteLegale),
        robots: shouldNotIndex(uniteLegale)
          ? { follow: false, index: false }
          : { follow: true, index: true },
        alternates: {
          canonical,
        },
      }),
      links: [
        {
          rel: "canonical",
          href: canonical,
        },
      ],
    };
  },
  component: RouteComponent,
  errorComponent: HeaderDefaultError,
});

function RouteComponent() {
  const { triggerRedirectedEvent, uniteLegale, isBot, sourcesLastModified } =
    Route.useLoaderData();
  const { user } = useAuth();

  return (
    <>
      {triggerRedirectedEvent && (
        <MatomoEventFromRedirected sirenOrSiret={uniteLegale.siren} />
      )}
      <div className="content-container">
        <Title
          ficheType={FICHE.INFORMATION}
          uniteLegale={uniteLegale}
          user={user}
        />
        {estNonDiffusibleStrict(uniteLegale) ? (
          <NonDiffusibleStrictSection />
        ) : (
          <>
            <UniteLegaleSummarySection uniteLegale={uniteLegale} user={user} />
            {hasRights({ user }, ApplicationRights.isAgent) && (
              <EspaceAgentSummarySection
                uniteLegale={uniteLegale}
                user={user}
              />
            )}
            {uniteLegale.dateMiseAJourInpi && (
              <UniteLegaleImmatriculationSection
                rneLastModified={sourcesLastModified.rne}
                uniteLegale={uniteLegale}
                user={user}
              />
            )}
            {isCollectiviteTerritoriale(uniteLegale) && (
              <CollectiviteTerritorialeSection uniteLegale={uniteLegale} />
            )}
            {isServicePublic(uniteLegale) && (
              <ServicePublicSection uniteLegale={uniteLegale} />
            )}
            {isAvocat(uniteLegale) && (
              <AvocatsSection uniteLegale={uniteLegale} />
            )}
            {!isBot && isAssociation(uniteLegale) && (
              <AssociationSection uniteLegale={uniteLegale} user={user} />
            )}
            <HorizontalSeparator />
            {uniteLegale.siege && (
              <EtablissementSection
                etablissement={uniteLegale.siege}
                uniteLegale={uniteLegale}
                usedInEntreprisePage={true}
                user={user}
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
