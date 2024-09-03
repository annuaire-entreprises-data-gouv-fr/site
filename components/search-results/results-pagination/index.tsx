import { buildSearchQuery, IParams } from '#models/search/search-filter-params';
import React from 'react';
import pagesArray from './pages-array';

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
  searchTerm = '',
  searchfilterParams?: IParams,
  urlComplement = ''
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
      {compact ? '' : 'Première page'}
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
      {compact ? '' : 'Dernière page'}
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
      {compact ? '' : 'Page précédente'}
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
      {compact ? '' : 'Page suivante'}
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
      href={urlParams(pageNum, searchTerm, searchFilterParams, urlComplement)}
      className="fr-pagination__link "
      aria-current={currentPage === pageNum ? 'page' : undefined}
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
const ResultsPagination: React.FC<IProps> = ({
  currentPage,
  searchTerm,
  totalPages,
  searchFilterParams,
  urlComplement = '',
  compact = false,
}) => {
  const pages = pagesArray(currentPage, totalPages);
  if (pages.length === 1) {
    return null;
  }

  return (
    <div className="layout-center" style={{ margin: '15px auto' }}>
      <nav role="navigation" className="fr-pagination" aria-label="Pagination">
        <ul className="fr-pagination__list">
          <First
            currentPage={currentPage}
            searchTerm={searchTerm}
            totalPages={totalPages}
            compact={compact}
            searchFilterParams={searchFilterParams}
            urlComplement={urlComplement}
          />
          <Previous
            currentPage={currentPage}
            searchTerm={searchTerm}
            totalPages={totalPages}
            compact={compact}
            searchFilterParams={searchFilterParams}
            urlComplement={urlComplement}
          />
          {pages.map((pageNum) => {
            return (
              <Page
                searchFilterParams={searchFilterParams}
                currentPage={currentPage}
                searchTerm={searchTerm}
                pageNum={pageNum}
                urlComplement={urlComplement}
                key={pageNum}
              />
            );
          })}
          <Next
            currentPage={currentPage}
            searchTerm={searchTerm}
            compact={compact}
            totalPages={totalPages}
            searchFilterParams={searchFilterParams}
            urlComplement={urlComplement}
          />
          <Last
            currentPage={currentPage}
            compact={compact}
            searchTerm={searchTerm}
            totalPages={totalPages}
            searchFilterParams={searchFilterParams}
            urlComplement={urlComplement}
          />
        </ul>
      </nav>
    </div>
  );
};

export default ResultsPagination;
