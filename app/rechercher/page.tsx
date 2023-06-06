import { NextPage } from 'next';
import React from 'react';
import HiddenH1 from '#components/a11y-components/hidden-h1';
import SearchResults from '#components/search-results';
import { AdvancedSearchTutorial } from '#components/search-results/advanced-search-tutorial';
import StructuredDataSearchAction from '#components/structured-data/search';
import { searchWithoutProtectedSiren } from '#models/search';
import SearchFilterParams, {
  hasSearchParam,
} from '#models/search-filter-params';
import { parseIntWithDefaultValue } from '#utils/helpers';

type Props = {
  searchParams: {
    terme: string;
    page: string;
  };
};

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

const SearchResultPage = async ({ searchParams }: any) => {
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
