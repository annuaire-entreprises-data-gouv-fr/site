import { SearchErrorExplanations } from '#components/error-explanations';
import MapResults from '#components/map/map-results';
import { isAPINotResponding } from '#models/api-not-responding';
import { ISearchResults } from '#models/search';
import { IParams } from '#models/search-filter-params';
import ResultsCounter from './results-counter';
import ResultsList from './results-list';
import { NotEnoughParams } from './results-not-enough-params';
import ResultsPagination from './results-pagination';

const SearchResults: React.FC<{
  searchTerm?: string;
  results: ISearchResults;
  searchFilterParams?: IParams;
  map?: boolean;
}> = ({ results, searchTerm = '', searchFilterParams = {}, map = false }) => {
  if (isAPINotResponding(results)) {
    return <SearchErrorExplanations />;
  }

  if (results.notEnoughParams) {
    return <NotEnoughParams />;
  }

  if (!results.results || results.results.length === 0) {
    return (
      <ResultsCounter
        resultCount={results.resultCount}
        currentPage={results.currentPage}
      />
    );
  }

  if (map) {
    return (
      <>
        <div className="map-container">
          <MapResults results={results.results} />
          <div className="results-for-map-wrapper">
            <div className="results-list-wrapper">
              <div className="results-counter">
                <ResultsCounter
                  resultCount={results.resultCount}
                  currentPage={results.currentPage}
                />
              </div>
              <ResultsList results={results.results} />
            </div>
            <div className="results-footer-wrapper">
              <ResultsPagination
                totalPages={results.pageCount}
                currentPage={results.currentPage}
                searchTerm={searchTerm}
                compact={true}
                searchFilterParams={searchFilterParams}
              />
            </div>
          </div>
        </div>

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
      </>
    );
  } else {
    return (
      <>
        <ResultsCounter
          resultCount={results.resultCount}
          currentPage={results.currentPage}
        />
        <div>
          <ResultsList results={results.results} searchTerm={searchTerm} />
          <ResultsPagination
            totalPages={results.pageCount}
            searchTerm={searchTerm}
            currentPage={results.currentPage}
            searchFilterParams={searchFilterParams}
          />
        </div>
      </>
    );
  }
};

export default SearchResults;
