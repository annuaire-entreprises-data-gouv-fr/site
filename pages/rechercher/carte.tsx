import React from 'react';

import { GetServerSideProps } from 'next';
import Page from '../../layouts';
import PageCounter from '../../components/results-page-counter';

import { parseIntWithDefaultValue } from '../../utils/helpers/formatting';
import ResultsHeader from '../../components/results-header';
import search, { ISearchResults } from '../../models/search';
import ResultsList from '../../components/results-list';
import MapResults from '../../components/map/map-results';
import HiddenH1 from '../../components/a11y-components/hidden-h1';
import StructuredDataSearchAction from '../../components/structured-data/search';
import { isAPINotResponding } from '../../models/api-not-responding';
import { SearchErrorExplanations } from '../../components/error-explanations';
import SearchFilterParams, { IParams } from '../../models/search-filter-params';
import {
  IPropsWithMetadata,
  postServerSideProps,
} from '../../utils/server-side-props-helper/post-server-side-props';

interface IProps extends IPropsWithMetadata {
  searchTerm: string;
  results: ISearchResults;
  searchFilterParams: IParams;
}

const MapSearchResultPage: React.FC<IProps> = ({
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
  >
    <StructuredDataSearchAction />
    <HiddenH1 title="Résultats de recherche" />
    {isAPINotResponding(results) ? (
      <SearchErrorExplanations />
    ) : (
      <>
        {results.results ? (
          <div className="map-container">
            <MapResults results={results.results} />
            <div className="results-for-map-wrapper">
              <div className="results-list-wrapper">
                <div className="results-counter">
                  <ResultsHeader
                    resultCount={results.resultCount}
                    searchTerm={searchTerm}
                    currentPage={results.currentPage}
                    isMap={true}
                    searchFilterParams={searchFilterParams}
                  />
                </div>
                <ResultsList results={results.results} />
              </div>
              <div className="results-footer-wrapper">
                <PageCounter
                  totalPages={results.pageCount}
                  currentPage={results.currentPage}
                  querySuffix={`terme=${searchTerm}`}
                  compact={true}
                  searchFilterParams={searchFilterParams}
                />
              </div>
            </div>
          </div>
        ) : (
          <ResultsHeader
            resultCount={results.resultCount}
            searchTerm={searchTerm}
            currentPage={results.currentPage}
            searchFilterParams={searchFilterParams}
          />
        )}
      </>
    )}

    <style jsx>{`
      .map-container {
        display: flex;
        flex-direction: row-reverse;
        height: calc(100vh - 180px);
      }
      .results-for-map-wrapper {
        width: 550px;
        flex-shrink: 0;
        font-size: 1rem;
        height: 100%;
        overflow: auto;
      }
      .results-for-map-wrapper > .results-list-wrapper {
        padding: 0 10px;
        height: calc(100% - 50px);
        overflow: auto;
      }
      .results-for-map-wrapper > .results-footer-wrapper {
        height: 50px;
        width: 100%;
        display: flex;
        border-top: 1px solid #dfdff1;
      }
      .results-counter {
        margin-top: 10px;
        margin-bottom: 10px;
        color: rgb(112, 117, 122);
        margin-bottom: 15px;
      }

      @media only screen and (min-width: 1px) and (max-width: 1100px) {
        .map-container {
          display: block;
          height: auto;
        }

        .results-for-map-wrapper {
          width: 100%;
        }

        .results-for-map-wrapper > .results-list-wrapper {
          height: auto;
          overflow: none;
        }
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

export default MapSearchResultPage;
