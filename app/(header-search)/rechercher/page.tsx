import HiddenH1 from '#components/a11y-components/hidden-h1';
import { NPSBanner } from '#components/banner/nps';
import Footer from '#components/footer';
import { HeaderWithAdvancedSearch } from '#components/header/header-advanced-search';
import SearchResults from '#components/search-results';
import { AdvancedSearchTutorial } from '#components/search-results/advanced-search-tutorial';
import SocialNetworks from '#components/social-network';
import StructuredDataSearchAction from '#components/structured-data/search';
import { searchWithoutProtectedSiren } from '#models/search';
import SearchFilterParams, {
  hasSearchParam,
} from '#models/search/search-filter-params';
import { parseIntWithDefaultValue } from '#utils/helpers';
import { AppRouterProps } from '#utils/server-side-helper/app/extract-params';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Rechercher une entreprise, un service public ou une association',
  alternates: {
    canonical: 'https://annuaire-entreprises.data.gouv.fr/rechercher',
  },
  robots: 'noindex, nofollow',
};

const SearchResultPage = async (props: AppRouterProps) => {
  const searchParams = await props.searchParams;

  const searchTerm = (searchParams.terme || '') as string;
  const pageParam = (searchParams.page || '') as string;
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
      <HeaderWithAdvancedSearch
        useSearchBar={true}
        useAgentCTA={true}
        useMap={false}
        searchParams={searchFilterParamsJSON}
        currentSearchTerm={searchTerm}
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
              searchTerm={searchTerm}
              searchFilterParams={searchFilterParamsJSON}
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
