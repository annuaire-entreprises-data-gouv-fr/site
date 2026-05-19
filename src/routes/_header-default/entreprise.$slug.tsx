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
import { NotFound } from "#/components/screens/not-found";
import ServicePublicSection from "#/components/service-public-section";
import Title from "#/components/title-section";
import { FICHE } from "#/components/title-section/tabs";
import { HorizontalSeparator } from "#/components-ui/horizontal-separator";
import { useAuth } from "#/contexts/auth.context";
import { EAdministration } from "#/models/administrations/EAdministration";
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
import { FetchRessourceException } from "#/models/exceptions";
import { getRechercheEntrepriseSourcesLastModified } from "#/models/recherche-entreprise-modified";
import { getUniteLegaleFromSlugFn } from "#/server-functions/public/unite-legale";
import { getBaseUrl } from "#/utils/get-base-url";
import {
  extractSirenOrSiretSlugFromUrl,
  isLikelyASiren,
  isLikelyASiret,
  shouldNotIndex,
  uniteLegalePageDescription,
  uniteLegalePageTitle,
} from "#/utils/helpers";
import {
  getDepartementFromCodePostal,
  getUrlFromDepartement,
  libelleFromDepartement,
} from "#/utils/helpers/formatting/labels";
import logErrorInSentry from "#/utils/sentry";
import { meta } from "#/utils/seo";
import isUserAgentABot from "#/utils/user-agent";
import { HeaderDefaultError } from "./-error";

const loadEntreprisePage = createServerFn()
  .inputValidator(
    z.object({
      slug: z.string(),
      isRedirected: z.boolean(),
      page: z.number().default(1),
    })
  )
  .handler(async ({ data: { slug, isRedirected, page } }) => {
    const [uniteLegale, sourcesLastModified] = await Promise.all([
      getUniteLegaleFromSlugFn({
        data: { slug, page },
      }),
      getRechercheEntrepriseSourcesLastModified(),
    ]);

    if (!uniteLegale) {
      logErrorInSentry(
        new FetchRessourceException({
          cause: new Error("[DEBUG] UniteLegale not found in serverFn"),
          ressource: "EmptyUniteLegaleFromEntreprisePageServerFn",
          context: {
            slug,
            page: page.toString(),
          },
          administration: EAdministration.DINUM,
        })
      );
    }

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
          page,
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
    page: z.number().min(1).optional().default(1).catch(1),
    "avocats-page": z.number().min(1).optional().default(1).catch(1),
  }),
  search: {
    middlewares: [stripSearchParams({ page: 1, "avocats-page": 1 })],
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
  loaderDeps: ({ search }) => ({
    redirected: search.redirected,
    page: search.page,
  }),
  loader: async ({ params, deps }) => {
    const result = await loadEntreprisePage({
      data: {
        slug: params.slug,
        isRedirected: deps.redirected === 1,
        page: deps.page,
      },
    });

    if (!result.uniteLegale) {
      logErrorInSentry(
        new FetchRessourceException({
          cause: new Error(
            "[DEBUG] UniteLegale not found but loader did not error"
          ),
          ressource: "EmptyUniteLegaleFromEntreprisePageLoader",
          context: {
            slug: params.slug,
            page: deps.page.toString(),
          },
          administration: EAdministration.DINUM,
        })
      );
    }

    return result;
  },
  head: ({ loaderData, match }) => {
    if (!loaderData) {
      return meta.notFound();
    }

    const { uniteLegale } = loaderData;

    if (!uniteLegale) {
      logErrorInSentry(
        new FetchRessourceException({
          cause: new Error("[DEBUG] UniteLegale not found in head"),
          ressource: "EmptyUniteLegaleFromEntreprisePageHead",
          context: {
            slug: match.params.slug,
            page: match.search.page.toString(),
          },
          administration: EAdministration.DINUM,
        })
      );
    }

    const canonical = `https://annuaire-entreprises.data.gouv.fr/entreprise/${uniteLegale.siren}`;
    const naf = uniteLegale.activitePrincipale;
    const dep = getDepartementFromCodePostal(uniteLegale.siege.codePostal);
    const depUrl = getUrlFromDepartement(dep || "");

    return {
      meta: meta({
        title: uniteLegalePageTitle(uniteLegale),
        description: uniteLegalePageDescription(uniteLegale),
        robots: shouldNotIndex(uniteLegale)
          ? "noindex, nofollow"
          : "index, follow",
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
      scripts:
        dep && depUrl && naf
          ? [
              {
                type: "application/ld+json",
                children: JSON.stringify({
                  "@context": "https://schema.org",
                  "@type": "BreadcrumbList",
                  itemListElement: [
                    {
                      "@type": "ListItem",
                      position: 1,
                      name: "Entreprises par départements",
                      item: "https://annuaire-entreprises.data.gouv.fr/departements/index.html",
                    },
                    {
                      "@type": "ListItem",
                      position: 2,
                      name: `${libelleFromDepartement(dep)}`,
                      item: `https://annuaire-entreprises.data.gouv.fr/departements/${depUrl}/index.html`,
                    },
                    {
                      "@type": "ListItem",
                      position: 3,
                      name: naf,
                      item: `https://annuaire-entreprises.data.gouv.fr/departements/${depUrl}/${naf}/1.html`,
                    },
                  ],
                }),
              },
            ]
          : [],
    };
  },
  component: RouteComponent,
  errorComponent: HeaderDefaultError,
  notFoundComponent: () => <NotFound withWrapper={false} />,
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
    </>
  );
}
