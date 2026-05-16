import { createFileRoute, stripSearchParams } from "@tanstack/react-router";
import HiddenH1 from "#/components/a11y-components/hidden-h1";
import { BannerManager } from "#/components/banner/banner-manager";
import { NPSBanner } from "#/components/banner/nps";
import Footer from "#/components/footer";
import { HeaderWithAdvancedSearch } from "#/components/header/header-advanced-search";
import SearchResults from "#/components/search-results";
import { AdvancedSearchTutorial } from "#/components/search-results/advanced-search-tutorial";
import SocialNetworks from "#/components/social-network";
import { hasSearchParam } from "#/models/search/search-filter-params";
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
  errorComponent: HeaderSearchError,
});

function RouteComponent() {
  const { searchResults, searchFilterParamsJSON, searchTerm } =
    Route.useLoaderData();

  return (
    <>
      <NPSBanner />
      <BannerManager />
      <HeaderWithAdvancedSearch
        currentSearchTerm={searchTerm}
        searchParams={searchFilterParamsJSON}
        useAgentCTA={true}
        useMap={false}
        useSearchBar={true}
      />
      <main className="fr-container">
        <HiddenH1 title="Résultats de recherche" />
        <div className="content-container">
          {!hasSearchParam(searchFilterParamsJSON) && !searchTerm ? (
            <AdvancedSearchTutorial />
          ) : (
            <SearchResults
              results={searchResults}
              searchFilterParams={searchFilterParamsJSON}
              searchTerm={searchTerm}
            />
          )}
        </div>
      </main>
      <SocialNetworks />
      <Footer />
    </>
  );
}
