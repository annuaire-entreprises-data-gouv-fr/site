import { ISearchResults } from '#models/search';
import { IParams } from '#models/search/search-filter-params';
import ResultsCounter from './results-counter';
import ResultsList from './results-list';
import ResultsPagination from './results-pagination';
import { BadParams } from './results-problems/bad-params';
import { NotEnoughParams } from './results-problems/results-not-enough-params';

const SearchResults: React.FC<{
  searchTerm?: string;
  results: ISearchResults;
  searchFilterParams?: IParams;
}> = ({ results, searchTerm = '', searchFilterParams = {} }) => {
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
        isMap={false}
        currentSearchTerm={searchTerm}
        searchParams={searchFilterParams}
      />
    );
  }

  return (
    <>
      <ResultsCounter
        resultCount={results.resultCount}
        currentPage={results.currentPage}
        isMap={false}
        currentSearchTerm={searchTerm}
        searchParams={searchFilterParams}
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
};

export default SearchResults;
