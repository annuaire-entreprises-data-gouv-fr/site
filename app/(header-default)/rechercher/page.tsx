import { Metadata } from 'next';
import HiddenH1 from '#components/a11y-components/hidden-h1';
import SearchResults from '#components/search-results';
import { AdvancedSearchTutorial } from '#components/search-results/advanced-search-tutorial';
import StructuredDataSearchAction from '#components/structured-data/search';
import { ISearchResults, searchWithoutProtectedSiren } from '#models/search';
import SearchFilterParams, {
  IParams,
  hasSearchParam,
} from '#models/search-filter-params';
import { parseIntWithDefaultValue } from '#utils/helpers';

export const metadata: Metadata = {
  title: 'Rechercher une entreprise',
  alternates: {
    canonical: 'https://annuaire-entreprises.data.gouv.fr/rechercher',
  },
  robots: 'index, follow',
};

async function SearchResultPage({
  searchParams,
}: {
  searchParams: Record<string, string>;
}) {
  const { results, searchFilterParams, searchTerm } = await getServerSideProps(
    searchParams
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
            searchFilterParams={searchFilterParams}
          />
        )}
      </div>
    </>
  );
}

type IServerSideProps = {
  searchTerm: string;
  results: ISearchResults;
  searchFilterParams: IParams;
};
async function getServerSideProps(
  searchParams: Record<string, string>
): Promise<IServerSideProps> {
  // get params from query string
  const searchTerm = (searchParams.terme || '') as string;
  const pageParam = (searchParams.page || '') as string;

  const page = parseIntWithDefaultValue(pageParam, 1);
  const searchFilterParams = new SearchFilterParams(searchParams);

  const results = await searchWithoutProtectedSiren(
    searchTerm,
    page,
    searchFilterParams
  );

  return {
    results,
    searchTerm,
    searchFilterParams: searchFilterParams.toJSON(),
  };
}

export default SearchResultPage;
