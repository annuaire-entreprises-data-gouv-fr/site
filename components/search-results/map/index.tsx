import { redirect } from "next/navigation";
import MapWithResults from "#components/map/map-results";
import type { ISearchResults } from "#models/search";
import {
  buildSearchQuery,
  type IParams,
} from "#models/search/search-filter-params";
import ResultsCounter from "../results-counter";
import ResultsList from "../results-list";
import ResultsPagination from "../results-pagination";
import styles from "./style.module.css";

const SearchResultsMap: React.FC<{
  searchTerm?: string;
  results: ISearchResults;
  searchFilterParams?: IParams;
}> = ({ results, searchTerm = "", searchFilterParams = {} }) => {
  const height = "calc(100vh - 230px)";

  if (
    results.notEnoughParams ||
    results.badParams ||
    !results.results ||
    results.results.length === 0
  ) {
    redirect(`/rechercher/${buildSearchQuery(searchTerm, searchFilterParams)}`);
  }
  const shouldColorZipCode = !!searchFilterParams.cp_dep;

  return (
    <>
      <div className={styles["map-container"]} style={{ height: height }}>
        <MapWithResults
          height={height}
          results={results}
          shouldColorZipCode={shouldColorZipCode}
        />
        <div className={styles["results-for-map-wrapper"]}>
          <ResultsCounter
            currentPage={results.currentPage}
            currentSearchTerm={searchTerm}
            isMap={true}
            resultCount={results.resultCount}
            searchParams={searchFilterParams}
          />
          <ResultsList
            results={results.results}
            shouldColorZipCode={shouldColorZipCode}
          />
        </div>
      </div>
      <div className={styles["results-footer-wrapper"]}>
        <div className="fr-container">
          <ResultsPagination
            compact={true}
            currentPage={results.currentPage}
            searchFilterParams={searchFilterParams}
            searchTerm={searchTerm}
            totalPages={results.pageCount}
          />
        </div>
      </div>
    </>
  );
};

export default SearchResultsMap;
