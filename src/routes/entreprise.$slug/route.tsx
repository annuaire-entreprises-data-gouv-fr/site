import {
  createFileRoute,
  Link,
  notFound,
  Outlet,
  redirect,
  stripSearchParams,
  useLocation,
} from "@tanstack/react-router";
import { type ReactNode, useMemo } from "react";
import z from "zod";
import { INSEE } from "#/components/administrations";
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
import { Warning } from "#/components-ui/alerts";
import { BackToTop } from "#/components-ui/back-to-top";
import { useFeatureFlag } from "#/hooks/use-feature-flag";
import {
  UNITE_LEGALE_STALE_TIME,
  uniteLegaleQueryKey,
  useCachedUniteLegale,
  useSeedUniteLegaleQueryCache,
} from "#/hooks/use-unite-legale-query-cache";
import { type IUniteLegale, isFondation } from "#/models/core/types";
import { getUniteLegaleFromSlugFn } from "#/server-functions/public/unite-legale";
import { getUniteLegaleTheme } from "#/utils/get-unite-legale-theme";
import { formatIntFr } from "#/utils/helpers";
import {
  extractSirenOrSiretSlugFromUrl,
  isLikelyASiren,
  isLikelyASiret,
} from "#/utils/helpers/siren-and-siret";
import { meta } from "#/utils/seo";
import { HeaderDefaultError } from "../_header-default/-error";
import { ENTREPRISE_TAB_TO_FICHE, entrepriseFicheSchema } from "./-loader";

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

  // Same company already loaded (e.g. other tab or other etablissements page):
  // keep its title and tabs, only the content is loading
  const cachedUniteLegale = useCachedUniteLegale(
    extractSirenOrSiretSlugFromUrl(slug)
  );

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

  useSeedUniteLegaleQueryCache(uniteLegale, etablissmentsPage);

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

  const pageContent = uniteLegale.oldSiren ? (
    <Warning full>
      Le siren {formatIntFr(uniteLegale.oldSiren)} a été identifié comme un
      doublon et purgé du répertoire SIRENE par l'
      <INSEE />. Il n'apparaît pas non plus dans le registre national des
      entreprises. En conséquence, il n'existe plus aucune information liée à ce
      siren, qui ne doit plus être utilisé. Les informations de cette unité
      légale sont disponibles sur la page du siren conservé :{" "}
      <Link params={{ slug: uniteLegale.siren }} to="/entreprise/$slug">
        {formatIntFr(uniteLegale.siren)}
      </Link>
      .
    </Warning>
  ) : (
    <>
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
    </>
  );

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
        {pageContent}
      </main>
      <SocialNetworks />
      <Question />
      <Footer />
      <BackToTop />
    </>
  );
}
