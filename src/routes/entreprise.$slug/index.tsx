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
import { HorizontalSeparator } from "#/components-ui/horizontal-separator";
import { useAuth } from "#/contexts/auth.context";
import { isAPINotResponding } from "#/models/api-not-responding";
import {
  ApplicationRights,
  hasRights,
} from "#/models/authentication/user/rights";
import { estNonDiffusibleStrict } from "#/models/core/diffusion";
import {
  isAssociation,
  isAvocat,
  isCollectiviteTerritoriale,
  isFondation,
  isServicePublic,
} from "#/models/core/types";
import { getExtraitKbis } from "#/models/espace-agent/extrait-kbis";
import { Exception } from "#/models/exceptions";
import { getRechercheEntrepriseSourcesLastModified } from "#/models/recherche-entreprise-modified";
import { getBaseUrl } from "#/utils/get-base-url";
import {
  shouldNotIndex,
  uniteLegalePageDescription,
  uniteLegalePageTitle,
} from "#/utils/helpers";
import {
  getDepartementFromCodePostal,
  getUrlFromDepartement,
  libelleFromDepartement,
} from "#/utils/helpers/formatting/labels";
import { verifySiren } from "#/utils/helpers/siren-and-siret";
import logErrorInSentry from "#/utils/sentry";
import { meta } from "#/utils/seo";
import getSession from "#/utils/server-side-helper/get-session";
import isUserAgentABot from "#/utils/user-agent";
import { HeaderDefaultError } from "../_header-default/-error";

const loadEntreprisePage = createServerFn({ method: "POST" })
  .validator(
    z.object({
      siren: z.string().transform(verifySiren),
      isRedirected: z.boolean(),
      estPersonneMorale: z.boolean(),
      estRadieBodacc: z.boolean(),
      dateRadiationBodacc: z.string().nullable(),
    })
  )
  .handler(async ({ data }) => {
    const {
      siren,
      isRedirected,
      estPersonneMorale,
      estRadieBodacc,
      dateRadiationBodacc,
    } = data;
    const sourcesLastModified =
      await getRechercheEntrepriseSourcesLastModified();

    const isFromSite = isRedirected
      ? (getRequestHeader("referer") || "").startsWith(getBaseUrl())
      : false;

    const triggerRedirectedEvent = isFromSite && isRedirected;

    const userAgent = getRequestHeader("user-agent") || "";
    const isBot = isUserAgentABot(userAgent);

    if (estRadieBodacc) {
      const session = await getSession();
      if (session?.user) {
        getExtraitKbis(siren, null)
          .then((extraitKbis) => {
            if (isAPINotResponding(extraitKbis)) {
              return;
            }
            if (
              (estPersonneMorale && !extraitKbis.dateRadiation) ||
              (!estPersonneMorale &&
                extraitKbis.dateRadiation !== dateRadiationBodacc)
            ) {
              logErrorInSentry(
                new Exception({
                  name: "ExtraitKbisDateRadiationMismatch",
                  message: "Extrait Kbis date radiation mismatch",
                  context: {
                    siren,
                    dateRadiationRCS: extraitKbis.dateRadiation ?? "null",
                    dateRadiationBodacc: dateRadiationBodacc ?? "null",
                  },
                })
              );
            }
          })
          .catch(() => {
            // ignore error
          });
      }
    }

    return { triggerRedirectedEvent, isBot, sourcesLastModified };
  });

export const Route = createFileRoute("/entreprise/$slug/")({
  validateSearch: z.object({
    redirected: z.literal(1).optional().catch(undefined),
    "avocats-page": z.number().min(1).optional().default(1).catch(1),
  }),
  search: {
    middlewares: [
      stripSearchParams({
        "avocats-page": 1,
      }),
    ],
  },
  loaderDeps: ({ search }) => ({
    redirected: search.redirected,
  }),
  loader: async ({ parentMatchPromise, params: { slug }, deps }) => {
    const { loaderData } = await parentMatchPromise;

    if (!loaderData) {
      throw notFound();
    }

    const { uniteLegale } = loaderData;

    if (isFondation(uniteLegale)) {
      throw redirect({
        to: "/fondation/$slug",
        params: { slug: uniteLegale.complements.numeroRnf },
        search: {
          from: "entreprise",
        },
        statusCode: 308,
      });
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
          redirected: deps.redirected,
        },
        statusCode: 308,
      });
    }
    const isRedirected = deps.redirected === 1;

    const pageData = await loadEntreprisePage({
      data: {
        siren: uniteLegale.siren,
        isRedirected,
        estPersonneMorale: uniteLegale.complements.estPersonneMorale,
        estRadieBodacc: uniteLegale.bodacc?.radiation?.estRadie ?? false,
        dateRadiationBodacc: uniteLegale.bodacc?.radiation?.date ?? null,
      },
    });

    return { ...pageData, uniteLegale };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return meta.notFound();
    }

    const { uniteLegale } = loaderData;

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
      {estNonDiffusibleStrict(uniteLegale) ? (
        <NonDiffusibleStrictSection />
      ) : (
        <>
          <UniteLegaleSummarySection uniteLegale={uniteLegale} user={user} />
          {hasRights({ user }, ApplicationRights.isAgent) && (
            <EspaceAgentSummarySection uniteLegale={uniteLegale} user={user} />
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
    </>
  );
}
