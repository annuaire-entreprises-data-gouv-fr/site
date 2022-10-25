import ResultsHeader from './results-header';
import { isAPINotResponding } from '../../models/api-not-responding';
import { ISearchResults } from '../../models/search';
import { IParams } from '../../models/search-filter-params';
import { SearchErrorExplanations } from '../error-explanations';
import MapResults from '../map/map-results';
import ResultsList from './results-list';
import PageCounter from '../results-page-counter';
import { getFaqArticlesByTag } from '../../models/faq';

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
      <div>
        <br />
        <svg
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          width="100px"
          viewBox="0 0 84 84"
        >
          <path
            d="M56.7 42.8A1 1 0 0 1 58 42c2.5.7 4.4 2.6 4.9 5a1 1 0 0 1-2 .5c-.4-1.6-1.7-3-3.4-3.4a1 1 0 0 1-.8-1.3Z"
            fill="#000091"
          />
          <path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M46.2 48.3a10.5 10.5 0 1 1 18.3 7L70.7 66a3.1 3.1 0 0 1-5.4 3.3v-.1L59 58.5a10.5 10.5 0 0 1-12.9-10.2Zm15 9.5L67 68.1a1 1 0 0 0 1.8-.9v-.1l-6-10.3c-.5.4-1.2.7-1.8 1Zm3.9-9.5a8.4 8.4 0 1 0-16.8 0 8.4 8.4 0 0 0 16.8 0Z"
            fill="#000091"
          />
          <path
            d="M72.4 18.8c0-.5-.5-1-1-1H14.6a1 1 0 0 0-1 1.1v48.4c.1.5.6 1 1.1 1h44.2c.5-.1 1-.6 1-1.1v-.1c-.1-.5-.6-1-1.1-1h-43V28.5h38.9a1 1 0 0 0-.1-2.1H15.7v-6.4h54.6v6.4h-9.5a1 1 0 0 0 .1 2h9.4V59a1 1 0 0 0 2.1-.1v-40Z"
            fill="#dfdff1"
          />
          <path
            d="M18.9 24.1a1 1 0 1 1 0-2 1 1 0 0 1 0 2ZM22 23.1a1 1 0 1 0 2.2 0 1 1 0 0 0-2.2 0ZM27.3 24.1a1 1 0 1 1 0-2 1 1 0 0 1 0 2ZM67.2 22a1 1 0 0 1 .1 2.1H35.7a1 1 0 0 1-.1-2h31.6ZM43 35.7c0-.6-.4-1-1-1H23a1 1 0 0 0 .1 2h19c.5 0 1-.5 1-1ZM37.8 41a1 1 0 0 1 .1 2H23.1a1 1 0 0 1-.1-2H37.8ZM36.7 48.3c0-.6-.4-1-1-1H23a1 1 0 0 0 .1 2h12.7c.5 0 1-.5 1-1Z"
            fill="#dfdff1"
          />
        </svg>
        <div>
          <b>
            Retrouvez toutes les informations publiques concernant les
            entreprises françaises
          </b>
          <ul>
            <li>
              Le moteur de recherche vous permet de retrouver une entreprise
              grâce à son nom, son SIREN, ou son adresse
            </li>
            <li>
              Vous pouvez également rechercher grâce à sa localisation précise,
              son domaine d’activité, ou son ou sa dirigeant(e)
            </li>
          </ul>
          <br />
          <b>
            Vous avez une question concernant le fonctionnement du moteur de
            recherche ?
          </b>
          <ul>
            {getFaqArticlesByTag(['search']).map(({ slug, title }) => (
              <li>
                <a href={`/faq/${slug}`}>{title}</a>
              </li>
            ))}
          </ul>
          <a href="/faq">→ Toutes les questions fréquentes</a>
        </div>
      </div>
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
              <ResultsList results={results.results} />
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
