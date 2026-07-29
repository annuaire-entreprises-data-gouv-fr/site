import { createFileRoute, stripSearchParams } from "@tanstack/react-router";
import HiddenH1 from "#/components/a11y-components/hidden-h1";
import { BannerManager } from "#/components/banner/banner-manager";
import { NPSBanner } from "#/components/banner/nps";
import Footer from "#/components/footer";
import { Header } from "#/components/header/header";
import SearchFondationsResults from "#/components/search-fondations-results";
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
  loader: async ({ deps }) => await searchFondationsFn({ data: deps }),
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
      <Header
        currentSearchTerm={searchTerm}
        searchPath="/rechercher/fondations"
        useAgentBanner={false}
        useAgentCTA
        useLogo={false}
        useMap={false}
        useSearchBar
      />
      <main className="fr-container">
        <HiddenH1 title="Résultats de recherche" />
        <div className="content-container">
          <SearchFondationsResults
            results={searchResults}
            searchFilterParams={searchFilterParamsJSON}
            searchTerm={searchTerm}
          />
        </div>
      </main>
      <SocialNetworks />
      <Footer />
    </>
  );
}
