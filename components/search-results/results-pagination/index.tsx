import React from 'react';
import HorizontalSeparator from '../../../components-ui/horizontal-separator';
import {
  buildSearchQuery,
  IParams,
} from '../../../models/search-filter-params';
import pagesArray from './pages-array';

interface IProps {
  currentPage: number;
  totalPages: number;
  compact?: boolean;
  searchTerm?: string;
  searchFilterParams?: IParams;
  anchor?: string;
}

const urlParams = (
  page = 1,
  searchTerm = '',
  searchfilterParams?: IParams,
  anchor = ''
) => {
  const searchQuery = buildSearchQuery(searchTerm, searchfilterParams || {});
  return `${searchQuery}&page=${page}${anchor}`;
};

const First: React.FC<IProps> = ({
  searchTerm,
  currentPage,
  compact,
  searchFilterParams,
  anchor,
}) => (
  <li>
    <a
      className="fr-pagination__link fr-pagination__link--first fr-pagination__link--lg-label"
      href={
        currentPage > 1
          ? urlParams(1, searchTerm, searchFilterParams, anchor)
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
  anchor,
}) => (
  <li>
    <a
      className="fr-pagination__link fr-pagination__link--last"
      href={
        currentPage < totalPages
          ? urlParams(totalPages, searchTerm, searchFilterParams, anchor)
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
  anchor,
}) => (
  <li>
    <a
      className="fr-pagination__link fr-pagination__link--prev fr-pagination__link--lg-label"
      href={
        currentPage > 1
          ? urlParams(currentPage - 1, searchTerm, searchFilterParams, anchor)
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
  anchor,
}) => (
  <li>
    <a
      className="fr-pagination__link fr-pagination__link--next fr-pagination__link--lg-label"
      href={
        currentPage < totalPages
          ? urlParams(currentPage + 1, searchTerm, searchFilterParams, anchor)
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
  anchor?: string;
}> = ({ pageNum, searchTerm, currentPage, searchFilterParams, anchor }) => (
  <li>
    <a
      href={urlParams(pageNum, searchTerm, searchFilterParams, anchor)}
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
  anchor = '',
  compact = false,
}) => {
  const pages = pagesArray(currentPage, totalPages);
  if (pages.length === 1) {
    return <HorizontalSeparator />;
  }

  return (
    <div className="layout-center">
      <nav role="navigation" className="fr-pagination" aria-label="Pagination">
        <ul className="fr-pagination__list">
          <First
            currentPage={currentPage}
            searchTerm={searchTerm}
            totalPages={totalPages}
            compact={compact}
            searchFilterParams={searchFilterParams}
            anchor={anchor}
          />
          <Previous
            currentPage={currentPage}
            searchTerm={searchTerm}
            totalPages={totalPages}
            compact={compact}
            searchFilterParams={searchFilterParams}
            anchor={anchor}
          />
          {pages.map((pageNum) => {
            return (
              <Page
                searchFilterParams={searchFilterParams}
                currentPage={currentPage}
                searchTerm={searchTerm}
                pageNum={pageNum}
                anchor={anchor}
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
            anchor={anchor}
          />
          <Last
            currentPage={currentPage}
            compact={compact}
            searchTerm={searchTerm}
            totalPages={totalPages}
            searchFilterParams={searchFilterParams}
            anchor={anchor}
          />
        </ul>
      </nav>
      <style jsx>{`
        div.layout-center {
          margin: 15px auto;
        }
      `}</style>
    </div>
  );
};

export default ResultsPagination;
