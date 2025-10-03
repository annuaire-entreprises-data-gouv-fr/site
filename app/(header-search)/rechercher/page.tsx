import type { Metadata } from "next";
import HiddenH1 from "#components/a11y-components/hidden-h1";
import { NPSBanner } from "#components/banner/nps";
import TempIncidentBanner from "#components/banner/temp-incident";
import Footer from "#components/footer";
import { HeaderWithAdvancedSearch } from "#components/header/header-advanced-search";
import SearchResults from "#components/search-results";
import { AdvancedSearchTutorial } from "#components/search-results/advanced-search-tutorial";
import SocialNetworks from "#components/social-network";
import StructuredDataSearchAction from "#components/structured-data/search";
import { searchWithoutProtectedSiren } from "#models/search";
import SearchFilterParams, {
  hasSearchParam,
} from "#models/search/search-filter-params";
import { parseIntWithDefaultValue } from "#utils/helpers";
import type { AppRouterProps } from "#utils/server-side-helper/app/extract-params";

export const metadata: Metadata = {
  title: "Rechercher une entreprise, une administration ou une association",
  alternates: {
    canonical: "https://annuaire-entreprises.data.gouv.fr/rechercher",
  },
  robots: "noindex, nofollow",
};

const SearchResultPage = async (props: AppRouterProps) => {
  const searchParams = await props.searchParams;

  const searchTerm = (searchParams.terme || "") as string;
  const pageParam = (searchParams.page || "") as string;
  const page = parseIntWithDefaultValue(pageParam, 1);
  const searchFilterParams = new SearchFilterParams(searchParams);
  const results = await searchWithoutProtectedSiren(
    searchTerm,
    page,
    searchFilterParams
  );
  const searchFilterParamsJSON = searchFilterParams.toJSON();

  return (
    <>
      <NPSBanner />
      <TempIncidentBanner />
      <HeaderWithAdvancedSearch
        currentSearchTerm={searchTerm}
        searchParams={searchFilterParamsJSON}
        useAgentCTA={true}
        useMap={false}
        useSearchBar={true}
      />
      <main className="fr-container">
        <StructuredDataSearchAction />
        <HiddenH1 title="Résultats de recherche" />
        <div className="content-container">
          {!hasSearchParam(searchFilterParamsJSON) && !searchTerm ? (
            <AdvancedSearchTutorial />
          ) : (
            <SearchResults
              results={results}
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
};

export default SearchResultPage;
