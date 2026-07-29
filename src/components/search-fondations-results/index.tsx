import type { IParams } from "#/models/search/search-filter-params";
import type { ISearchFondationsResults } from "#/models/search-fondations";
import ResultsPagination from "../search-results/results-pagination";
import { BadParams } from "../search-results/results-problems/bad-params";
import { NotEnoughParams } from "../search-results/results-problems/results-not-enough-params";
import ResultsCounter from "./results-counter";
import ResultsList from "./results-list";

const SearchFondationsResults: React.FC<{
  searchTerm?: string;
  results: ISearchFondationsResults;
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

export default SearchFondationsResults;
