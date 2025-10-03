import type { ISearchResults } from "#models/search";
import type { IParams } from "#models/search/search-filter-params";
import ResultsCounter from "./results-counter";
import ResultsList from "./results-list";
import ResultsPagination from "./results-pagination";
import { BadParams } from "./results-problems/bad-params";
import { NotEnoughParams } from "./results-problems/results-not-enough-params";

const SearchResults: React.FC<{
  searchTerm?: string;
  results: ISearchResults;
  searchFilterParams?: IParams;
}> = ({ results, searchTerm = "", searchFilterParams = {} }) => {
  if (results.notEnoughParams) {
    return <NotEnoughParams />;
  }
  if (results.badParams) {
    return <BadParams />;
  }

  if (!results.results || results.results.length === 0) {
    return (
      <ResultsCounter
        currentPage={results.currentPage}
        currentSearchTerm={searchTerm}
        isMap={false}
        resultCount={results.resultCount}
        searchParams={searchFilterParams}
      />
    );
  }

  return (
    <>
      <ResultsCounter
        currentPage={results.currentPage}
        currentSearchTerm={searchTerm}
        isMap={false}
        resultCount={results.resultCount}
        searchParams={searchFilterParams}
      />
      <div>
        <ResultsList
          results={results.results}
          shouldColorZipCode={!!searchFilterParams.cp_dep}
        />
        <ResultsPagination
          currentPage={results.currentPage}
          searchFilterParams={searchFilterParams}
          searchTerm={searchTerm}
          totalPages={results.pageCount}
        />
      </div>
    </>
  );
};

export default SearchResults;
