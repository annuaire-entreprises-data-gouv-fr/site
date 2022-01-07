import React from 'react';

import { GetServerSideProps } from 'next';
import Page from '../../layouts';
import PageCounter from '../../components/results-page-counter';
import { redirectIfSiretOrSiren } from '../../utils/redirects/routers';

import { parseIntWithDefaultValue } from '../../utils/helpers/formatting';
import ResultsHeader from '../../components/results-header';
import search, { ISearchResults } from '../../models/search';
import ResultsList from '../../components/results-list';
import MapResults from '../../components/map/map-results';
import { IsLikelyASirenOrSiretException } from '../../models';
import { redirectServerError } from '../../utils/redirects';
import HiddenH1 from '../../components/a11y-components/hidden-h1';
import StructuredDataSearchAction from '../../components/structured-data/search';

interface IProps extends ISearchResults {
  searchTerm: string;
  currentPage: number;
}

const MapSearchResultPage: React.FC<IProps> = ({
  results,
  pageCount,
  resultCount,
  searchTerm,
  currentPage = 1,
}) => (
  <Page
    small={true}
    currentSearchTerm={searchTerm}
    map={true}
    noIndex={true}
    title="Rechercher une entreprise"
    canonical="https://annuaire-entreprises.data.gouv.fr/rechercher/carte"
  >
    <StructuredDataSearchAction />
    <HiddenH1 title="Résultats de recherche" />

    {results ? (
      <div className="map-container">
        <MapResults results={results} />
        <div className="results-for-map-wrapper">
          <div className="results-list-wrapper">
            <div className="results-counter">
              <ResultsHeader
                resultCount={resultCount}
                searchTerm={searchTerm}
                currentPage={currentPage}
                isMap={true}
              />
            </div>
            <ResultsList results={results} />
          </div>
          <div className="results-footer-wrapper">
            <PageCounter
              totalPages={pageCount}
              currentPage={currentPage}
              querySuffix={`terme=${searchTerm}`}
              compact={true}
            />
          </div>
        </div>
      </div>
    ) : (
      <ResultsHeader
        resultCount={resultCount}
        searchTerm={searchTerm}
        currentPage={currentPage}
      />
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

export const getServerSideProps: GetServerSideProps = async (context) => {
  // get params from query string
  const searchTermParam = (context.query.terme || '') as string;
  const pageParam = (context.query.page || '') as string;

  const page = parseIntWithDefaultValue(pageParam, 1);

  try {
    const results = (await search(searchTermParam, page)) || {};
    return {
      props: {
        ...results,
        searchTerm: searchTermParam,
      },
    };
  } catch (e: any) {
    if (e instanceof IsLikelyASirenOrSiretException) {
      return redirectIfSiretOrSiren(e.message);
    } else {
      return redirectServerError(e.message);
    }
  }
};

export default MapSearchResultPage;
