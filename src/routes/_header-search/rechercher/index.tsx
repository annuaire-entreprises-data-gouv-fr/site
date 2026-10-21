import { createFileRoute, stripSearchParams } from "@tanstack/react-router";
import type { ReactNode } from "react";
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
  type IParams,
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
  loader: async ({ deps }) => await searchFn({ data: deps }),
  component: RouteComponent,
  pendingMs: 100,
  pendingMinMs: 300,
  pendingComponent: RoutePendingComponent,
  errorComponent: HeaderSearchError,
});

function RoutePendingComponent() {
  const search = Route.useSearch();

  return (
    <SearchLayout
      searchFilterParams={new SearchFilterParams(search).toJSON()}
      searchTerm={search.terme}
    >
      <SearchResultsSkeleton />
    </SearchLayout>
  );
}

function RouteComponent() {
  const { searchResults, searchFilterParamsJSON, searchTerm } =
    Route.useLoaderData();

  return (
    <SearchLayout
      searchFilterParams={searchFilterParamsJSON}
      searchTerm={searchTerm}
    >
      {hasSearchParam(searchFilterParamsJSON) || searchTerm ? (
        <SearchResults
          results={searchResults}
          searchFilterParams={searchFilterParamsJSON}
          searchTerm={searchTerm}
        />
      ) : (
        <AdvancedSearchTutorial />
      )}
    </SearchLayout>
  );
}

function SearchLayout({
  children,
  searchFilterParams,
  searchTerm,
}: {
  children: ReactNode;
  searchFilterParams: IParams;
  searchTerm: string;
}) {
  return (
    <>
      <NPSBanner />
      <BannerManager />
      <HeaderWithAdvancedSearch
        currentSearchTerm={searchTerm}
        // search bar and filters keep their own state, initialised from these
        // props: remount them when the search changes (e.g. a filter cleared
        // client-side, or browser back/forward), as a full page load would
        key={JSON.stringify([searchTerm, searchFilterParams])}
        searchParams={searchFilterParams}
        useAgentCTA={true}
        useMap={false}
        useSearchBar={true}
      />
      <main className="fr-container">
        <HiddenH1 title="Résultats de recherche" />
        <div className="content-container">{children}</div>
      </main>
      <SocialNetworks />
      <Footer />
      <BackToTop />
    </>
  );
}
