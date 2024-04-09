import MapResults from '#components/map/map-results';
import { ISearchResults } from '#models/search';
import { IParams } from '#models/search-filter-params';
import { BadParams } from './bad-params';
import ResultsCounter from './results-counter';
import ResultsList from './results-list';
import { NotEnoughParams } from './results-not-enough-params';
import ResultsPagination from './results-pagination';
import styles from './style.module.css';

const SearchResults: React.FC<{
  searchTerm?: string;
  results: ISearchResults;
  searchFilterParams?: IParams;
  map?: boolean;
}> = ({ results, searchTerm = '', searchFilterParams = {}, map = false }) => {
  if (results.notEnoughParams) {
    return <NotEnoughParams />;
  }
  if (results.badParams) {
    return <BadParams />;
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
        <div className={styles['map-container']}>
          <MapResults results={results.results} />
          <div className={styles['results-for-map-wrapper']}>
            <div className={styles['results-list-wrapper']}>
              <div className={styles['results-counter']}>
                <ResultsCounter
                  resultCount={results.resultCount}
                  currentPage={results.currentPage}
                />
              </div>
              <ResultsList results={results.results} />
            </div>
            <div className={styles['results-footer-wrapper']}>
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
          <ResultsList
            results={results.results}
            shouldColorZipCode={!!searchFilterParams.cp_dep}
          />
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
