import { Metadata } from 'next';
import HiddenH1 from '#components/a11y-components/hidden-h1';
import SearchResults from '#components/search-results';
import { AdvancedSearchTutorial } from '#components/search-results/advanced-search-tutorial';
import StructuredDataSearchAction from '#components/structured-data/search';
import { searchWithoutProtectedSiren } from '#models/search';
import SearchFilterParams, {
  hasSearchParam,
} from '#models/search-filter-params';
import { parseIntWithDefaultValue } from '#utils/helpers';
import { AppRouterProps } from '#utils/server-side-helper/app/extract-params';
import withErrorHandler from '#utils/server-side-helper/app/with-error-handler';

export const metadata: Metadata = {
  title: 'Rechercher une entreprise, un service public ou une association',
  alternates: {
    canonical: 'https://annuaire-entreprises.data.gouv.fr/rechercher',
  },
  robots: 'noindex, nofollow',
};

const SearchResultPage = withErrorHandler(async function UniteLegalePage(
  props: AppRouterProps
) {
  const searchTerm = (props.searchParams.terme || '') as string;
  const pageParam = (props.searchParams.page || '') as string;
  const page = parseIntWithDefaultValue(pageParam, 1);
  const searchFilterParams = new SearchFilterParams(props.searchParams);
  const results = await searchWithoutProtectedSiren(
    searchTerm,
    page,
    searchFilterParams
  );

  return (
    <>
      <StructuredDataSearchAction />
      <HiddenH1 title="Résultats de recherche" />
      <div className="content-container">
        {!hasSearchParam(searchFilterParams) && !searchTerm ? (
          <AdvancedSearchTutorial />
        ) : (
          <SearchResults
            results={results}
            searchTerm={searchTerm}
            searchFilterParams={searchFilterParams.toJSON()}
          />
        )}
      </div>
    </>
  );
});

export default SearchResultPage;
