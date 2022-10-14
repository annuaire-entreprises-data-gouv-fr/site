import ResultsHeader from './results-header';
import { isAPINotResponding } from '../../models/api-not-responding';
import { ISearchResults } from '../../models/search';
import { IParams } from '../../models/search-filter-params';
import { SearchErrorExplanations } from '../error-explanations';
import MapResults from '../map/map-results';
import ResultsList from './results-list';
import PageCounter from '../results-page-counter';

const ResultsBody: React.FC<{
  searchTerm: string;
  results: ISearchResults;
  searchFilterParams: IParams;
  map?: boolean;
}> = ({ results, searchTerm, searchFilterParams, map = false }) => {
  if (isAPINotResponding(results)) {
    return <SearchErrorExplanations />;
  }

  if (results.notEnoughParams) {
    return (
      <p>
        Votre requête ne contient pas assez de paramètres de recherche. Vous
        pouvez :
        <ul>
          <li>utiliser un terme de recherche plus long</li>
          <li>
            utiliser des critères de recherche géographiques ou administratifs
          </li>
          <li>
            rechercher le nom et le prénom d’un(e) dirigeant(e) d’entreprise
          </li>
        </ul>
      </p>
    );
  }

  if (!results.results || results.results.length === 0) {
    return (
      <ResultsHeader
        resultCount={results.resultCount}
        searchTerm={searchTerm}
        currentPage={results.currentPage}
        searchFilterParams={searchFilterParams}
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
                <ResultsHeader
                  resultCount={results.resultCount}
                  searchTerm={searchTerm}
                  currentPage={results.currentPage}
                  isMap={true}
                  searchFilterParams={searchFilterParams}
                />
              </div>
              <ResultsList
                results={results.results}
                searchFilterParams={searchFilterParams}
              />
            </div>
            <div className="results-footer-wrapper">
              <PageCounter
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
        <ResultsHeader
          resultCount={results.resultCount}
          searchTerm={searchTerm}
          currentPage={results.currentPage}
          searchFilterParams={searchFilterParams}
        />
        <div>
          <ResultsList
            results={results.results}
            withFeedback={true}
            searchTerm={searchTerm}
            searchFilterParams={searchFilterParams}
          />
          <PageCounter
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

export default ResultsBody;
