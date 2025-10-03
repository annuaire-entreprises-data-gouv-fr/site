import type React from "react";
import {
  buildSearchQuery,
  type IParams,
} from "#models/search/search-filter-params";
import pagesArray from "./pages-array";

type IProps = {
  currentPage: number;
  totalPages: number;
  compact?: boolean;
  searchTerm?: string;
  searchFilterParams?: IParams;
  urlComplement?: string;
};

const urlParams = (
  page = 1,
  searchTerm = "",
  searchfilterParams?: IParams,
  urlComplement = ""
) => {
  const searchQuery = buildSearchQuery(searchTerm, searchfilterParams || {});
  return `${searchQuery}&page=${page}${urlComplement}`;
};

const First: React.FC<IProps> = ({
  searchTerm,
  currentPage,
  compact,
  searchFilterParams,
  urlComplement,
}) => (
  <li>
    <a
      className="fr-pagination__link fr-pagination__link--first fr-pagination__link--lg-label"
      href={
        currentPage > 1
          ? urlParams(1, searchTerm, searchFilterParams, urlComplement)
          : undefined
      }
    >
      {compact ? "" : "Première page"}
    </a>
  </li>
);

const Last: React.FC<IProps> = ({
  currentPage,
  searchTerm,
  totalPages,
  compact,
  searchFilterParams,
  urlComplement,
}) => (
  <li>
    <a
      className="fr-pagination__link fr-pagination__link--last"
      href={
        currentPage < totalPages
          ? urlParams(totalPages, searchTerm, searchFilterParams, urlComplement)
          : undefined
      }
    >
      {compact ? "" : "Dernière page"}
    </a>
  </li>
);
const Previous: React.FC<IProps> = ({
  currentPage,
  searchTerm,
  searchFilterParams,
  compact,
  urlComplement,
}) => (
  <li>
    <a
      className="fr-pagination__link fr-pagination__link--prev fr-pagination__link--lg-label"
      href={
        currentPage > 1
          ? urlParams(
              currentPage - 1,
              searchTerm,
              searchFilterParams,
              urlComplement
            )
          : undefined
      }
    >
      {compact ? "" : "Page précédente"}
    </a>
  </li>
);

const Next: React.FC<IProps> = ({
  currentPage,
  searchTerm,
  totalPages,
  searchFilterParams,
  compact,
  urlComplement,
}) => (
  <li>
    <a
      className="fr-pagination__link fr-pagination__link--next fr-pagination__link--lg-label"
      href={
        currentPage < totalPages
          ? urlParams(
              currentPage + 1,
              searchTerm,
              searchFilterParams,
              urlComplement
            )
          : undefined
      }
    >
      {compact ? "" : "Page suivante"}
    </a>
  </li>
);

const Page: React.FC<{
  pageNum: number;
  searchTerm?: string;
  currentPage: number;
  searchFilterParams?: IParams;
  urlComplement?: string;
}> = ({
  pageNum,
  searchTerm,
  currentPage,
  searchFilterParams,
  urlComplement,
}) => (
  <li>
    <a
      aria-current={currentPage === pageNum ? "page" : undefined}
      className="fr-pagination__link "
      href={urlParams(pageNum, searchTerm, searchFilterParams, urlComplement)}
      title={`Page ${pageNum}`}
    >
      {pageNum}
    </a>
  </li>
);

/**
 * Page counter component. Be careful as it is not zero-indexed. Pages starts at 1
 * @param param0
 * @returns
 */
const PageCounter: React.FC<IProps> = ({
  currentPage,
  searchTerm,
  totalPages,
  searchFilterParams,
  urlComplement = "",
  compact = false,
}) => {
  const pages = pagesArray(currentPage, totalPages);
  if (pages.length === 1) {
    return null;
  }

  return (
    <div className="layout-center" style={{ margin: "15px auto" }}>
      <nav aria-label="Pagination" className="fr-pagination" role="navigation">
        <ul className="fr-pagination__list">
          <First
            compact={compact}
            currentPage={currentPage}
            searchFilterParams={searchFilterParams}
            searchTerm={searchTerm}
            totalPages={totalPages}
            urlComplement={urlComplement}
          />
          <Previous
            compact={compact}
            currentPage={currentPage}
            searchFilterParams={searchFilterParams}
            searchTerm={searchTerm}
            totalPages={totalPages}
            urlComplement={urlComplement}
          />
          {pages.map((pageNum) => (
            <Page
              currentPage={currentPage}
              key={pageNum}
              pageNum={pageNum}
              searchFilterParams={searchFilterParams}
              searchTerm={searchTerm}
              urlComplement={urlComplement}
            />
          ))}
          <Next
            compact={compact}
            currentPage={currentPage}
            searchFilterParams={searchFilterParams}
            searchTerm={searchTerm}
            totalPages={totalPages}
            urlComplement={urlComplement}
          />
          <Last
            compact={compact}
            currentPage={currentPage}
            searchFilterParams={searchFilterParams}
            searchTerm={searchTerm}
            totalPages={totalPages}
            urlComplement={urlComplement}
          />
        </ul>
      </nav>
    </div>
  );
};

export default PageCounter;
