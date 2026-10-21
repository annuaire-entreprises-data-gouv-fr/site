import {
  Await,
  createFileRoute,
  stripSearchParams,
} from "@tanstack/react-router";
import HiddenH1 from "#/components/a11y-components/hidden-h1";
import { BannerManager } from "#/components/banner/banner-manager";
import { NPSBanner } from "#/components/banner/nps";
import Footer from "#/components/footer";
import { HeaderWithAdvancedSearch } from "#/components/header/header-advanced-search";
import SearchResults from "#/components/search-results";
import { AdvancedSearchTutorial } from "#/components/search-results/advanced-search-tutorial";
import { SearchResultsSkeleton } from "#/components/search-results/skeleton";
import SocialNetworks from "#/components/social-network";
import { BackToTop } from "#/components-ui/back-to-top";
import SearchFilterParams, {
  hasSearchParam,
} from "#/models/search/search-filter-params";
import { meta } from "#/utils/seo";
import { HeaderSearchError } from "../-error";
import {
  beforeLoadCheckTerme,
  searchDefaultParams,
  searchFn,
  searchLoaderDeps,
  searchQueryParamsSchema,
} from "../-loader";

export const Route = createFileRoute("/_header-search/rechercher/")({
  validateSearch: searchQueryParamsSchema,
  search: {
    middlewares: [stripSearchParams(searchDefaultParams)],
  },
  loaderDeps: searchLoaderDeps,
  head: () => {
    const canonical = "https://annuaire-entreprises.data.gouv.fr/rechercher";
    return {
      meta: meta({
        title: "Résultats de recherche",
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
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebSite",
            url: "https://annuaire-entreprises.data.gouv.fr",
            potentialAction: [
              {
                "@type": "SearchAction",
                target: {
                  "@type": "EntryPoint",
                  urlTemplate:
                    "https://annuaire-entreprises.data.gouv.fr/rechercher?terme={search_term_string}",
                },
                "query-input": "required name=search_term_string",
              },
              {
                "@type": "SearchAction",
                target: {
                  "@type": "EntryPoint",
                  urlTemplate:
                    "https://annuaire-entreprises.data.gouv.fr/rechercher/carte?terme={search_term_string}",
                },
                "query-input": "required name=search_term_string",
              },
            ],
          }),
        },
      ],
    };
  },
  beforeLoad: async (ctx) => {
    const searchTerm = ctx.search.terme;

    beforeLoadCheckTerme(searchTerm);
  },
  // On client-side navigations, search results are deferred: the page (and
  // its header) renders at once and the results are displayed when ready.
  // Server-side rendering waits for them so that the page works without JS.
  loader: async ({ deps }) => {
    const search = searchFn({ data: deps });
    return { search: typeof window === "undefined" ? await search : search };
  },
  component: RouteComponent,
  errorComponent: HeaderSearchError,
});

function RouteComponent() {
  const { search } = Route.useLoaderData();
  const loaderDeps = Route.useLoaderDeps();
  const searchParams = Route.useSearch();
  const searchFilterParams = new SearchFilterParams(searchParams).toJSON();
  const searchKey = JSON.stringify([searchParams.terme, searchFilterParams]);

  return (
    <>
      <NPSBanner />
      <BannerManager />
      <HeaderWithAdvancedSearch
        currentSearchTerm={searchParams.terme}
        // search bar and filters keep their own state, initialised from these
        // props: remount them when the search changes (e.g. a filter cleared
        // client-side, or browser back/forward), as a full page load would
        key={searchKey}
        searchParams={searchFilterParams}
        useAgentCTA={true}
        useMap={false}
        useSearchBar={true}
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
              {renderSearchResults}
            </Await>
          ) : (
            renderSearchResults(search)
          )}
        </div>
      </main>
      <SocialNetworks />
      <Footer />
      <BackToTop />
    </>
  );
}

function renderSearchResults({
  searchResults,
  searchFilterParamsJSON,
  searchTerm,
}: Awaited<ReturnType<typeof searchFn>>) {
  return hasSearchParam(searchFilterParamsJSON) || searchTerm ? (
    <SearchResults
      results={searchResults}
      searchFilterParams={searchFilterParamsJSON}
      searchTerm={searchTerm}
    />
  ) : (
    <AdvancedSearchTutorial />
  );
}
