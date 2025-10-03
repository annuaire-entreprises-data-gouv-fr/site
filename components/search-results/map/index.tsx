import MapWithResults from "#components/map/map-results";
import type { ISearchResults } from "#models/search";
import { buildSearchQuery, type IParams } from "#models/search/search-filter-params";
import { redirect } from "next/navigation";
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
          results={results}
          height={height}
          shouldColorZipCode={shouldColorZipCode}
        />
        <div className={styles["results-for-map-wrapper"]}>
          <ResultsCounter
            resultCount={results.resultCount}
            currentPage={results.currentPage}
            isMap={true}
            currentSearchTerm={searchTerm}
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
            totalPages={results.pageCount}
            currentPage={results.currentPage}
            searchTerm={searchTerm}
            compact={true}
            searchFilterParams={searchFilterParams}
          />
        </div>
      </div>
    </>
  );
};

export default SearchResultsMap;
