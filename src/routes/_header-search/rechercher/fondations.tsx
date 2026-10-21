import {
  Await,
  createFileRoute,
  stripSearchParams,
} from "@tanstack/react-router";
import HiddenH1 from "#/components/a11y-components/hidden-h1";
import { BannerManager } from "#/components/banner/banner-manager";
import { NPSBanner } from "#/components/banner/nps";
import Footer from "#/components/footer";
import { Header } from "#/components/header/header";
import SearchFondationsResults from "#/components/search-fondations-results";
import { SearchResultsSkeleton } from "#/components/search-results/skeleton";
import SocialNetworks from "#/components/social-network";
import { meta } from "#/utils/seo";
import { HeaderSearchError } from "../-error";
import {
  beforeLoadFondationsCheckTerme,
  searchDefaultParams,
  searchFondationsFn,
  searchLoaderDeps,
  searchQueryParamsSchema,
} from "../-loader";

export const Route = createFileRoute("/_header-search/rechercher/fondations")({
  validateSearch: searchQueryParamsSchema,
  search: {
    middlewares: [stripSearchParams(searchDefaultParams)],
  },
  loaderDeps: searchLoaderDeps,
  head: () => {
    const canonical =
      "https://annuaire-entreprises.data.gouv.fr/rechercher/fondations";
    return {
      meta: meta({
        title: "Résultats de recherche - Fondations",
        alternates: {
          canonical,
        },
        robots: "noindex, nofollow",
      }),
      links: [
        {
          rel: "canonical",
          href: canonical,
        },
      ],
    };
  },
  beforeLoad: async (ctx) => {
    const searchTerm = ctx.search.terme;

    beforeLoadFondationsCheckTerme(searchTerm);
  },
  // On client-side navigations, search results are deferred: the page (and
  // its header) renders at once and the results are displayed when ready.
  // Server-side rendering waits for them so that the page works without JS.
  loader: async ({ deps }) => {
    const search = searchFondationsFn({ data: deps });
    return { search: typeof window === "undefined" ? await search : search };
  },
  component: RouteComponent,
  errorComponent: HeaderSearchError,
});

function RouteComponent() {
  const { search } = Route.useLoaderData();
  const loaderDeps = Route.useLoaderDeps();
  const { terme } = Route.useSearch();

  return (
    <>
      <NPSBanner />
      <BannerManager />
      <Header
        currentSearchTerm={terme}
        // search bar is initialised from currentSearchTerm: remount it when
        // the search changes (e.g. browser back/forward)
        key={terme}
        searchPath="/rechercher/fondations"
        searchPlaceholder="Nom, adresse, n° RNF..."
        useAgentBanner={false}
        useAgentCTA
        useLogo={false}
        useMap={false}
        useSearchBar
      />
      <main className="fr-container">
        <HiddenH1 title="Résultats de recherche" />
        <div className="content-container">
          {search instanceof Promise ? (
            <Await
              fallback={<SearchResultsSkeleton />}
              // a new search shows the skeleton instead of the previous results
              key={JSON.stringify(loaderDeps)}
              promise={search}
            >
              {renderSearchFondationsResults}
            </Await>
          ) : (
            renderSearchFondationsResults(search)
          )}
        </div>
      </main>
      <SocialNetworks />
      <Footer />
    </>
  );
}

function renderSearchFondationsResults({
  searchResults,
  searchFilterParamsJSON,
  searchTerm,
}: Awaited<ReturnType<typeof searchFondationsFn>>) {
  return (
    <SearchFondationsResults
      results={searchResults}
      searchFilterParams={searchFilterParamsJSON}
      searchTerm={searchTerm}
    />
  );
}
