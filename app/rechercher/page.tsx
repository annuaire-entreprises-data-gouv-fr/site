import React from 'react';
import HiddenH1 from '#components/a11y-components/hidden-h1';
import SearchResults from '#components/search-results';
import { AdvancedSearchTutorial } from '#components/search-results/advanced-search-tutorial';
import StructuredDataSearchAction from '#components/structured-data/search';
import { ISearchResults } from '#models/search';
import { searchWithoutProtectedSiren } from '#models/search';
import SearchFilterParams, {
  IParams,
  hasSearchParam,
} from '#models/search-filter-params';
import { parseIntWithDefaultValue } from '#utils/helpers';
import { IPropsWithMetadata } from '#utils/server-side-props-helper/post-server-side-props';
import { NextPageWithLayout } from 'pages/_app';

interface IProps extends IPropsWithMetadata {
  searchTerm: string;
  results: ISearchResults;
  searchFilterParams: IParams;
}

const getData = async (
  searchTerm: string,
  page: number,
  searchFilterParams: SearchFilterParams
) => {
  const results = await searchWithoutProtectedSiren(
    searchTerm,
    page,
    searchFilterParams
  );
  return results;
};

const SearchResultPage: NextPageWithLayout<IProps> = async ({
  searchParams,
}) => {
  const pageParam = (searchParams.page || '') as string;
  const page = parseIntWithDefaultValue(pageParam, 1);
  const searchFilterParams = new SearchFilterParams(searchParams);

  const results = await getData(searchParams.terme, page, searchFilterParams);
  return (
    <>
      {/* <Meta
        title="Rechercher une entreprise"
        canonical="https://annuaire-entreprises.data.gouv.fr/rechercher"
      /> */}
      <StructuredDataSearchAction />
      <HiddenH1 title="Résultats de recherche" />
      <div className="content-container">
        {!hasSearchParam(searchFilterParams) && !searchParams.terme ? (
          <AdvancedSearchTutorial />
        ) : (
          <SearchResults
            results={results}
            searchTerm={searchParams.terme}
            searchFilterParams={searchFilterParams.toJSON()}
          />
        )}
      </div>
    </>
  );
};

export default SearchResultPage;
