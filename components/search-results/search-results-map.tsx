'use client';

import MapWithResults from '#components/map/map-results';
import { ISearchResults } from '#models/search';
import { IParams } from '#models/search-filter-params';
import ResultsCounter from './results-counter';
import ResultsList from './results-list';
import ResultsPagination from './results-pagination';
import { BadParams } from './results-problems/bad-params';
import { NotEnoughParams } from './results-problems/results-not-enough-params';

const SearchResultsMap: React.FC<{
  searchTerm?: string;
  results: ISearchResults;
  searchFilterParams?: IParams;
}> = ({ results, searchTerm = '', searchFilterParams = {} }) => {
  const height = 'calc(100vh - 280px)';

  if (searchTerm && results.notEnoughParams) {
    return (
      <div className="fr-container">
        <NotEnoughParams />
      </div>
    );
  }
  if (results.notEnoughParams) {
    return <MapWithResults results={results} height={height} />;
  }
  if (results.badParams) {
    return (
      <div className="fr-container">
        <BadParams />
      </div>
    );
  }

  if (!results.results || results.results.length === 0) {
    return (
      <ResultsCounter
        resultCount={results.resultCount}
        currentPage={results.currentPage}
      />
    );
  }

  return (
    <>
      <div className="map-container">
        <MapWithResults results={results} height={height} />
        <div className="results-for-map-wrapper">
          <ResultsList results={results.results} />
        </div>
      </div>
      <div className="results-footer-wrapper fr-container">
        <ResultsCounter
          resultCount={results.resultCount}
          currentPage={results.currentPage}
        />
        <ResultsPagination
          totalPages={results.pageCount}
          currentPage={results.currentPage}
          searchTerm={searchTerm}
          compact={true}
          searchFilterParams={searchFilterParams}
        />
      </div>

      <style jsx>{`
        .map-container {
          display: flex;
          flex-direction: row-reverse;
          height: ${height};
        }
        .results-for-map-wrapper {
          width: 550px;
          flex-shrink: 0;
          font-size: 0.9rem;
          line-height: 1.4rem;
          overflow: auto;
          padding: 0 10px;
        }
        .results-footer-wrapper {
          height: 60px;
          width: 100%;
          display: flex;
          position: fixed;
          bottom: 0;
          background-color: #fff;
          box-shadow: 0 0 10px -5px rgba(0, 0, 0, 0.4);
        }

        @media only screen and (min-width: 1px) and (max-width: 1100px) {
          .map-container {
            display: block;
            height: auto;
          }

          .results-for-map-wrapper {
            width: 100%;
          }

          .results-footer-wrapper {
            flex-direction: column;
            height: 100px;
          }
        }
      `}</style>
    </>
  );
};

export default SearchResultsMap;
