import {
  createFileRoute,
  notFound,
  Outlet,
  redirect,
  stripSearchParams,
  useLocation,
} from "@tanstack/react-router";
import { type ReactNode, useEffect, useMemo } from "react";
import z from "zod";
import { BannerManager } from "#/components/banner/banner-manager";
import { NPSBanner } from "#/components/banner/nps";
import Footer from "#/components/footer";
import { Header } from "#/components/header/header";
import { LeaveFondation } from "#/components/header/leave-fondation";
import { Question } from "#/components/question";
import {
  EntreprisePageSkeleton,
  EntrepriseSectionsSkeleton,
} from "#/components/screens/entreprise.$slug/skeleton";
import { NotFound } from "#/components/screens/not-found";
import SocialNetworks from "#/components/social-network";
import { TitleFondation } from "#/components/title-fondation-section";
import Title from "#/components/title-section";
import { BackToTop } from "#/components-ui/back-to-top";
import { useAuth } from "#/contexts/auth.context";
import { useFeatureFlag } from "#/hooks/use-feature-flag";
import type { IAgentInfo } from "#/models/authentication/agent";
import { getUserQueryKey } from "#/models/authentication/user/query-key";
import { type IUniteLegale, isFondation } from "#/models/core/types";
import { getUniteLegaleFromSlugFn } from "#/server-functions/public/unite-legale";
import { getUniteLegaleTheme } from "#/utils/get-unite-legale-theme";
import {
  extractSirenOrSiretSlugFromUrl,
  isLikelyASiren,
  isLikelyASiret,
} from "#/utils/helpers/siren-and-siret";
import { meta } from "#/utils/seo";
import { HeaderDefaultError } from "../_header-default/-error";
import { ENTREPRISE_TAB_TO_FICHE, entrepriseFicheSchema } from "./-loader";

/**
 * Unité légale is cached by siren (not slug) so that switching between
 * /entreprise/{chemin} and /entreprise/{siren}/... does not refetch it.
 * It is anonymised depending on the user's rights, hence the user in the key.
 */
const uniteLegaleQueryKey = (
  user: IAgentInfo | null,
  siren: string,
  page?: number
) => {
  const key = ["unite-legale", getUserQueryKey(user), siren];
  return page === undefined ? key : [...key, page];
};

const UNITE_LEGALE_STALE_TIME = 5 * 60 * 1000;

export const Route = createFileRoute("/entreprise/$slug")({
  validateSearch: z.object({
    from: z
      .union([z.literal("entreprise"), z.literal("fondation")])
      .nullable()
      .default(null)
      .catch(null),
    "etablissments-page": z.number().min(1).optional().default(1).catch(1),
  }),
  search: {
    middlewares: [
      stripSearchParams({
        from: null,
        "etablissments-page": 1,
      }),
    ],
  },
  loaderDeps: ({ search }) => ({
    etablissmentsPage: search["etablissments-page"],
  }),
  beforeLoad: ({ params }) => {
    const { slug } = z.object({ slug: z.string() }).parse(params);

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
  loader: async ({
    params,
    deps,
    context: { queryClient },
    parentMatchPromise,
  }) => {
    const { slug } = z.object({ slug: z.string() }).parse(params);

    // root loader is revalidated on every navigation: this is the current session
    const { loaderData } = await parentMatchPromise;

    const uniteLegale = await queryClient.query({
      queryKey: uniteLegaleQueryKey(
        loaderData?.user ?? null,
        extractSirenOrSiretSlugFromUrl(slug),
        deps.etablissmentsPage
      ),
      queryFn: () =>
        getUniteLegaleFromSlugFn({
          data: { slug, page: deps.etablissmentsPage },
        }),
      staleTime: UNITE_LEGALE_STALE_TIME,
    });

    return { uniteLegale };
  },
  head: ({ match }) =>
    match.status === "error" || match.status === "notFound"
      ? meta.notFound()
      : {},
  component: RouteComponent,
  // Show the skeleton almost immediately instead of blocking navigation
  // until the unité légale is fetched (default pendingMs is 1000)
  pendingMs: 100,
  pendingMinMs: 300,
  pendingComponent: RoutePendingComponent,
  errorComponent: ({ error }) => (
    <>
      <BannerManager />
      <Header useAgentBanner={true} useAgentCTA={true} useSearchBar={true} />
      <main className="fr-container">
        <HeaderDefaultError error={error} />
      </main>
      <SocialNetworks />
      <Question />
      <Footer />
      <BackToTop />
    </>
  ),
  notFoundComponent: () => (
    <>
      <BannerManager />
      <Header useAgentBanner={true} useAgentCTA={true} useSearchBar={true} />
      <main className="fr-container">
        <NotFound withWrapper={false} />
      </main>
      <SocialNetworks />
      <Question />
      <Footer />
      <BackToTop />
    </>
  ),
});

function RoutePendingComponent() {
  const { slug } = Route.useParams();
  const { queryClient } = Route.useRouteContext();
  const { user } = useAuth();

  // Same company already loaded (e.g. other tab or other etablissements page):
  // keep its title and tabs, only the content is loading
  const cachedUniteLegale = queryClient
    .getQueriesData<IUniteLegale>({
      queryKey: uniteLegaleQueryKey(user, extractSirenOrSiretSlugFromUrl(slug)),
    })
    .find(([, data]) => data)?.[1];

  if (cachedUniteLegale) {
    return (
      <EntrepriseLayout uniteLegale={cachedUniteLegale}>
        <EntrepriseSectionsSkeleton />
      </EntrepriseLayout>
    );
  }

  return (
    <>
      <BannerManager />
      <Header useAgentBanner={true} useAgentCTA={true} useSearchBar={true} />
      <main className="fr-container">
        <EntreprisePageSkeleton />
      </main>
      <SocialNetworks />
      <Question />
      <Footer />
      <BackToTop />
    </>
  );
}

function RouteComponent() {
  const { uniteLegale } = Route.useLoaderData();
  const { etablissmentsPage } = Route.useLoaderDeps();
  const { queryClient } = Route.useRouteContext();
  const { user } = useAuth();

  // Loader data from SSR is not in the client query cache: seed it so the
  // first client navigation to another tab does not refetch the unité légale
  useEffect(() => {
    const queryKey = uniteLegaleQueryKey(
      user,
      uniteLegale.siren,
      etablissmentsPage
    );
    if (!queryClient.getQueryData(queryKey)) {
      queryClient.setQueryData(queryKey, uniteLegale);
    }
  }, [queryClient, user, uniteLegale, etablissmentsPage]);

  return (
    <EntrepriseLayout uniteLegale={uniteLegale}>
      <Outlet />
    </EntrepriseLayout>
  );
}

function EntrepriseLayout({
  children,
  uniteLegale,
}: {
  children: ReactNode;
  uniteLegale: IUniteLegale;
}) {
  const { pathname } = useLocation();
  const { from } = Route.useSearch();

  const fiche = useMemo(() => {
    const result = entrepriseFicheSchema.safeParse(pathname.split("/")[3]);
    if (!result.success) {
      return "entreprise";
    }
    return result.data;
  }, [pathname]);

  const isFromFondation = isFondation(uniteLegale) && from === "fondation";
  const isFondationsEnabled = useFeatureFlag("fondations_enabled");

  return (
    <>
      {isFromFondation && <LeaveFondation />}
      <NPSBanner />
      <BannerManager />
      <Header
        searchPath={isFromFondation ? "/rechercher/fondations" : undefined}
        searchPlaceholder={
          isFromFondation ? "Chercher un fonds ou une fondation" : undefined
        }
        useAgentBanner={true}
        useAgentCTA={true}
        useSearchBar={true}
      />
      <main className="fr-container" style={getUniteLegaleTheme(uniteLegale)}>
        {isFondation(uniteLegale) && isFondationsEnabled.isEnabled ? (
          <TitleFondation
            fondationName={uniteLegale.nomComplet}
            fondationRNF={uniteLegale.complements.numeroRnf}
            uniteLegale={uniteLegale}
          />
        ) : (
          <Title
            ficheType={ENTREPRISE_TAB_TO_FICHE[fiche]}
            uniteLegale={uniteLegale}
          />
        )}
        {children}
      </main>
      <SocialNetworks />
      <Question />
      <Footer />
      <BackToTop />
    </>
  );
}
