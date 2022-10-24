import React from 'react';

import { GetServerSideProps } from 'next';
import Page from '../../layouts';
import { parseIntWithDefaultValue } from '../../utils/helpers/formatting';
import search, { ISearchResults } from '../../models/search';
import HiddenH1 from '../../components/a11y-components/hidden-h1';
import StructuredDataSearchAction from '../../components/structured-data/search';
import SearchFilterParams, { IParams } from '../../models/search-filter-params';
import {
  IPropsWithMetadata,
  postServerSideProps,
} from '../../utils/server-side-props-helper/post-server-side-props';
import ResultsBody from '../../components/search-results/results-body';

interface IProps extends IPropsWithMetadata {
  searchTerm: string;
  results: ISearchResults;
  searchFilterParams: IParams;
}

const SearchResultPage: React.FC<IProps> = ({
  results,
  searchTerm,
  searchFilterParams,
  metadata,
}) => (
  <Page
    small={true}
    currentSearchTerm={searchTerm}
    searchFilterParams={searchFilterParams}
    title="Rechercher une entreprise"
    canonical="https://annuaire-entreprises.data.gouv.fr"
    isBrowserOutdated={metadata.isBrowserOutdated}
    useAdvancedSearch={true}
  >
    <StructuredDataSearchAction />
    <HiddenH1 title="Résultats de recherche" />
    <ResultsBody
      results={results}
      searchTerm={searchTerm}
      searchFilterParams={searchFilterParams}
    />
  </Page>
);

export const getServerSideProps: GetServerSideProps = postServerSideProps(
  async (context) => {
    // get params from query string
    const searchTerm = (context.query.terme || '') as string;
    const pageParam = (context.query.page || '') as string;
    const page = parseIntWithDefaultValue(pageParam, 1);
    const searchFilterParams = new SearchFilterParams(context.query);
    const results = await search(searchTerm, page, searchFilterParams);

    return {
      props: {
        results,
        searchTerm,
        searchFilterParams: searchFilterParams.toJSON(),
      },
    };
  }
);

export default SearchResultPage;
