import {
  createFileRoute,
  notFound,
  redirect,
  stripSearchParams,
} from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { getRequestHeader } from "@tanstack/react-start/server";
import z from "zod";
import EtablissementEffectifsMensuelsSection from "#/components/etablissement-effectifs-mensuels-section";
import { natureEffectifValues } from "#/components/etablissement-effectifs-mensuels-section/protected-effectifs-mensuels-section";
import EtablissementSection from "#/components/etablissement-section";
import MatomoEventFromRedirected from "#/components/matomo-event/search-redirected";
import { NonDiffusibleStrictSection } from "#/components/non-diffusible-section";
import { NotFound } from "#/components/screens/not-found";
import ServicePublicSection from "#/components/service-public-section";
import { TitleEtablissementWithDenomination } from "#/components/title-section/etablissement";
import { useAuth } from "#/contexts/auth.context";
import { estNonDiffusibleStrict } from "#/models/core/diffusion";
import { isServicePublic } from "#/models/core/types";
import { getEtablissementWithUniteLegaleFromSlugFn } from "#/server-functions/public/etablissement";
import { getBaseUrl } from "#/utils/get-base-url";
import {
  etablissementPageDescription,
  etablissementPageTitle,
  extractSirenOrSiretSlugFromUrl,
  isLikelyASiren,
  isLikelyASiret,
  shouldNotIndex,
} from "#/utils/helpers";
import { meta } from "#/utils/seo";
import isUserAgentABot from "#/utils/user-agent";
import { HeaderDefaultError } from "./-error";

const loadEtablissementPage = createServerFn()
  .inputValidator(z.object({ slug: z.string(), isRedirected: z.boolean() }))
  .handler(async ({ data: { slug, isRedirected } }) => {
    const { etablissement, uniteLegale } =
      await getEtablissementWithUniteLegaleFromSlugFn({
        data: { slug },
      });

    const isFromSite = isRedirected
      ? (getRequestHeader("referer") || "").startsWith(getBaseUrl())
      : false;

    const triggerRedirectedEvent = isFromSite && isRedirected;

    const userAgent = getRequestHeader("user-agent") || "";
    const isBot = isUserAgentABot(userAgent);

    return { etablissement, uniteLegale, triggerRedirectedEvent, isBot };
  });

const currentYear = new Date().getFullYear();

export const Route = createFileRoute("/_header-default/etablissement/$slug")({
  validateSearch: z.object({
    redirected: z.literal(1).optional().catch(undefined),
    "effectifs-mensuels-annee": z
      .number()
      .min(currentYear - 5)
      .max(currentYear)
      .optional()
      .default(currentYear)
      .catch(currentYear),
    "effectifs-mensuels-nature-effectif": z
      .enum(natureEffectifValues)
      .optional()
      .default("moyen")
      .catch("moyen"),
  }),
  search: {
    middlewares: [
      stripSearchParams({
        "effectifs-mensuels-annee": currentYear,
        "effectifs-mensuels-nature-effectif": "moyen",
      }),
    ],
  },
  beforeLoad: async ({ params }) => {
    const slug = params.slug;
    const sirenOrSiretSlug = extractSirenOrSiretSlugFromUrl(slug);

    if (isLikelyASiren(sirenOrSiretSlug)) {
      throw redirect({
        to: "/entreprise/$slug",
        params: { slug: sirenOrSiretSlug },
      });
    }
    if (!isLikelyASiret(sirenOrSiretSlug)) {
      throw notFound();
    }
  },
  loaderDeps: ({ search }) => ({ redirected: search.redirected }),
  loader: async ({ params, deps }) =>
    await loadEtablissementPage({
      data: { slug: params.slug, isRedirected: deps.redirected === 1 },
    }),
  head: ({ loaderData }) => {
    if (!loaderData) {
      return meta.notFound();
    }

    const { etablissement, uniteLegale } = loaderData;
    const canonical = `https://annuaire-entreprises.data.gouv.fr/etablissement/${etablissement.siret}`;
    const title = `${
      etablissement.estSiege ? "Siège social" : "Etablissement secondaire"
    } - ${etablissementPageTitle(etablissement, uniteLegale)}`;

    return {
      meta: meta({
        title,
        description: etablissementPageDescription(etablissement, uniteLegale),
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
    };
  },
  component: RouteComponent,
  errorComponent: HeaderDefaultError,
  notFoundComponent: () => <NotFound withWrapper={false} />,
});

function RouteComponent() {
  const { etablissement, uniteLegale, triggerRedirectedEvent, isBot } =
    Route.useLoaderData();
  const { user } = useAuth();

  return (
    <>
      {triggerRedirectedEvent && (
        <MatomoEventFromRedirected sirenOrSiret={uniteLegale.siren} />
      )}
      <div className="content-container">
        <TitleEtablissementWithDenomination
          etablissement={etablissement}
          uniteLegale={uniteLegale}
          user={user}
        />
        {estNonDiffusibleStrict(etablissement) ? (
          <NonDiffusibleStrictSection />
        ) : (
          <>
            <EtablissementSection
              etablissement={etablissement}
              uniteLegale={uniteLegale}
              usedInEntreprisePage={false}
              user={user}
              withDenomination={true}
            />
            <EtablissementEffectifsMensuelsSection
              etablissement={etablissement}
              user={user}
            />
          </>
        )}
        {!isBot && isServicePublic(uniteLegale) && (
          <ServicePublicSection
            etablissement={etablissement}
            uniteLegale={uniteLegale}
          />
        )}
      </div>
    </>
  );
}
