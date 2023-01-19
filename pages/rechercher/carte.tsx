import { GetServerSideProps } from 'next';
import React, { ReactElement } from 'react';
import HiddenH1 from '#components/a11y-components/hidden-h1';
import SearchResults from '#components/search-results';
import StructuredDataSearchAction from '#components/structured-data/search';
import search, { ISearchResults } from '#models/search';
import SearchFilterParams, { IParams } from '#models/search-filter-params';
import { parseIntWithDefaultValue } from '#utils/helpers';
import {
  IPropsWithMetadata,
  postServerSideProps,
} from '#utils/server-side-props-helper/post-server-side-props';
import { NextPageWithLayout } from 'pages/_app';
import Page from '../../layouts';

interface IProps extends IPropsWithMetadata {
  searchTerm: string;
  results: ISearchResults;
  searchFilterParams: IParams;
}

const MapSearchResultPage: NextPageWithLayout<IProps> = ({
  results,
  searchTerm,
  searchFilterParams,
  metadata,
}) => (
  <Page
    small={true}
    currentSearchTerm={searchTerm}
    searchFilterParams={searchFilterParams}
    map={true}
    noIndex={true}
    title="Rechercher une entreprise"
    canonical="https://annuaire-entreprises.data.gouv.fr/rechercher/carte"
    isBrowserOutdated={metadata.isBrowserOutdated}
    useAdvancedSearch={true}
  >
    <StructuredDataSearchAction />
    <HiddenH1 title="Résultats de recherche" />
    <div className="content-container">
      <SearchResults
        results={results}
        searchTerm={searchTerm}
        searchFilterParams={searchFilterParams}
        map={true}
      />
    </div>
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

MapSearchResultPage.getLayout = function getLayout(page: ReactElement) {
  return <>{page}</>;
};

export default MapSearchResultPage;
