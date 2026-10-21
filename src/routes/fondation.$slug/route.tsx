import { useQueryClient } from "@tanstack/react-query";
import {
  createFileRoute,
  Outlet,
  stripSearchParams,
} from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { getRequestHeader } from "@tanstack/react-start/server";
import { type ReactNode, useEffect } from "react";
import z from "zod";
import { BannerManager } from "#/components/banner/banner-manager";
import { NPSBanner } from "#/components/banner/nps";
import Footer from "#/components/footer";
import { Header } from "#/components/header/header";
import { LeaveFondation } from "#/components/header/leave-fondation";
import { Question } from "#/components/question";
import {
  EntrepriseSectionsSkeleton,
  EntrepriseTitleSkeleton,
} from "#/components/screens/entreprise.$slug/skeleton";
import { NotFound } from "#/components/screens/not-found";
import SocialNetworks from "#/components/social-network";
import { TitleFondation } from "#/components/title-fondation-section";
import { BackToTop } from "#/components-ui/back-to-top";
import { useAuth } from "#/contexts/auth.context";
import {
  UNITE_LEGALE_STALE_TIME,
  useSeedUniteLegaleQueryCache,
} from "#/hooks/use-unite-legale-query-cache";
import type { IAgentInfo } from "#/models/authentication/agent";
import { getUserQueryKey } from "#/models/authentication/user/query-key";
import type { IUniteLegale } from "#/models/core/types";
import { getRechercheEntrepriseSourcesLastModified } from "#/models/recherche-entreprise-modified";
import { getFondationFromSlugWithErrorHandling } from "#/server-functions/public/fondation.server";
import { getUniteLegaleFromSlugFn } from "#/server-functions/public/unite-legale";
import { defaultUniteLegaleTheme } from "#/utils/get-unite-legale-theme";
import { extractSirenFromSiret } from "#/utils/helpers";
import isUserAgentABot from "#/utils/user-agent";
import { HeaderDefaultError } from "./-error";

const loadFondationLayout = createServerFn({ method: "POST" })
  .validator(
    z.object({
      slug: z.string(),
      page: z.number().default(1),
    })
  )
  .handler(async ({ data: { slug, page } }) => {
    const [fondation, sourcesLastModified] = await Promise.all([
      getFondationFromSlugWithErrorHandling(slug, page),
      getRechercheEntrepriseSourcesLastModified(),
    ]);

    let uniteLegale: IUniteLegale | null = null;

    if (fondation.siret) {
      const siren = extractSirenFromSiret(fondation.siret);

      uniteLegale = await getUniteLegaleFromSlugFn({
        data: {
          slug: siren,
          page,
        },
      }).catch(() => null);
    }

    const userAgent = getRequestHeader("user-agent") || "";
    const isBot = isUserAgentABot(userAgent);

    return {
      fondation,
      uniteLegale,
      isBot,
      sourcesLastModified,
    };
  });

type IFondationLayoutData = Awaited<ReturnType<typeof loadFondationLayout>>;

/**
 * Fondation layout data is anonymised depending on the user's rights (through
 * its unité légale), hence the user in the key
 */
const fondationLayoutQueryKey = (
  user: IAgentInfo | null,
  slug: string,
  page?: number
) => {
  const key = ["fondation-layout", getUserQueryKey(user), slug];
  return page === undefined ? key : [...key, page];
};

export const Route = createFileRoute("/fondation/$slug")({
  validateSearch: z.object({
    page: z.number().min(1).optional().default(1).catch(1),
    from: z
      .union([z.literal("entreprise"), z.literal("fondation")])
      .nullable()
      .default(null)
      .catch(null),
  }),
  search: {
    middlewares: [
      stripSearchParams({
        page: 1,
        from: null,
      }),
    ],
  },
  loaderDeps: ({ search }) => ({
    page: search.page,
  }),
  loader: async ({
    params,
    deps,
    context: { queryClient },
    parentMatchPromise,
  }) => {
    const { slug } = z.object({ slug: z.string() }).parse(params);

    // root loader is revalidated on every navigation: this is the current session
    const { loaderData } = await parentMatchPromise;

    // Cached so that coming back to the fondation (e.g. from one of its
    // entreprise tabs) does not block child routes, which wait for this loader
    return await queryClient.query({
      queryKey: fondationLayoutQueryKey(
        loaderData?.user ?? null,
        slug,
        deps.page
      ),
      queryFn: () =>
        loadFondationLayout({
          data: {
            slug,
            page: deps.page,
          },
        }),
      staleTime: UNITE_LEGALE_STALE_TIME,
    });
  },
  component: RouteComponent,
  pendingMs: 100,
  pendingMinMs: 300,
  pendingComponent: RoutePendingComponent,
  errorComponent: HeaderDefaultError,
  notFoundComponent: () => <NotFound withWrapper={false} />,
});

function RoutePendingComponent() {
  const { slug } = Route.useParams();
  const queryClient = useQueryClient();
  const { user } = useAuth();

  // Same fondation already loaded (e.g. other page): keep its title and tabs
  const cached = queryClient
    .getQueriesData<IFondationLayoutData>({
      queryKey: fondationLayoutQueryKey(user, slug),
    })
    .find(([, data]) => data)?.[1];

  if (cached) {
    return (
      <FondationLayout uniteLegale={cached.uniteLegale}>
        <TitleFondation
          fondationName={cached.fondation.title}
          fondationRNF={cached.fondation.id}
          uniteLegale={cached.uniteLegale}
        />
        <EntrepriseSectionsSkeleton />
      </FondationLayout>
    );
  }

  return (
    <FondationLayout uniteLegale={null}>
      <div style={defaultUniteLegaleTheme}>
        <EntrepriseTitleSkeleton withDescription={false} />
        <EntrepriseSectionsSkeleton />
      </div>
    </FondationLayout>
  );
}

function RouteComponent() {
  const loaderData = Route.useLoaderData();
  const { fondation, uniteLegale } = loaderData;
  const { page } = Route.useLoaderDeps();
  const { slug } = Route.useParams();
  const queryClient = useQueryClient();
  const { user } = useAuth();

  // Loader data from SSR is not in the client query cache: seed it so that
  // coming back to this fondation does not refetch it
  useEffect(() => {
    const queryKey = fondationLayoutQueryKey(user, slug, page);
    if (!queryClient.getQueryData(queryKey)) {
      queryClient.setQueryData(queryKey, loaderData);
    }
  }, [queryClient, user, slug, page, loaderData]);

  // Fondation tabs link to the entreprise pages of its unité légale
  useSeedUniteLegaleQueryCache(uniteLegale, page);

  return (
    <FondationLayout uniteLegale={uniteLegale}>
      <TitleFondation
        fondationName={fondation.title}
        fondationRNF={fondation.id}
        uniteLegale={uniteLegale}
      />
      <Outlet />
    </FondationLayout>
  );
}

function FondationLayout({
  children,
  uniteLegale,
}: {
  children: ReactNode;
  uniteLegale: IUniteLegale | null;
}) {
  const { from } = Route.useSearch();

  const isFromEntrepriseSearch =
    from === "entreprise" || (from === null && !!uniteLegale);

  return (
    <>
      {!isFromEntrepriseSearch && <LeaveFondation />}
      <NPSBanner />
      <BannerManager />
      <Header
        searchPath={
          isFromEntrepriseSearch ? undefined : "/rechercher/fondations"
        }
        searchPlaceholder={
          isFromEntrepriseSearch
            ? undefined
            : "Chercher un fonds ou une fondation"
        }
        useAgentBanner={true}
        useAgentCTA={true}
        useSearchBar={true}
      />
      <main className="fr-container">
        <div className="content-container">{children}</div>
      </main>
      <SocialNetworks />
      <Question />
      <Footer />
      <BackToTop />
    </>
  );
}
