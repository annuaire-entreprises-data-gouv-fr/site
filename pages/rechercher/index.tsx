import React from 'react';

import { GetServerSideProps } from 'next';
import Page from '../../layouts';
import ResultsList from '../../components/results-list';
import PageCounter from '../../components/results-page-counter';
import { parseIntWithDefaultValue } from '../../utils/helpers/formatting';
import search, { ISearchResults } from '../../models/search';
import ResultsHeader from '../../components/results-header';
import HiddenH1 from '../../components/a11y-components/hidden-h1';
import StructuredDataSearchAction from '../../components/structured-data/search';
import { isAPINotResponding } from '../../models/api-not-responding';
import { SearchErrorExplanations } from '../../components/error-explanations';
import SearchFilterParams, { IParams } from '../../models/search-filter-params';
import MatomoEventSearchClick from '../../components/matomo-event/search-click';
import {
  IPropsWithMetadata,
  postServerSideProps,
} from '../../utils/server-side-props-helper/post-server-side-props';

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
  >
    <StructuredDataSearchAction />
    <HiddenH1 title="Résultats de recherche" />
    <div className="result-content-container">
      {isAPINotResponding(results) ? (
        <SearchErrorExplanations />
      ) : (
        <>
          <ResultsHeader
            resultCount={results.resultCount}
            searchTerm={searchTerm}
            currentPage={results.currentPage}
            notEnoughParams={results.notEnoughParams}
          />
          {results && (
            <div>
              <ResultsList
                results={results.results}
                withFeedback={true}
                searchTerm={searchTerm}
              />
              <PageCounter
                totalPages={results.pageCount}
                querySuffix={`terme=${searchTerm}`}
                currentPage={results.currentPage}
                searchFilterParams={searchFilterParams}
              />
              <MatomoEventSearchClick
                position={results.currentPage - 1}
                resultCount={results.resultCount}
                searchTerm={searchTerm}
                isAdvancedSearch={SearchFilterParams.hasParam(
                  searchFilterParams
                )}
              />
            </div>
          )}
        </>
      )}
    </div>

    <style jsx>{`
      .results-counter {
        margin-top: 20px;
        color: rgb(112, 117, 122);
      }
    `}</style>
  </Page>
);

export const getServerSideProps: GetServerSideProps = postServerSideProps(
  async (context) => {
    // get params from query string
    const searchTerm = (context.query.terme || '') as string;
    const pageParam = (context.query.page || '') as string;
    const page = parseIntWithDefaultValue(pageParam, 1);
    const searchFilterParams = new SearchFilterParams(context.query);

    const results = (await search(searchTerm, page, searchFilterParams)) || {};
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
