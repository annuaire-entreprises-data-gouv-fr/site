import React from 'react';
import SearchFilterParams, { IParams } from '../../models/search-filter-params';
import pagesArray from './pages-array';

interface IProps {
  currentPage: number;
  querySuffix?: string;
  totalPages: number;
  compact?: boolean;
  searchFilterParams?: IParams;
}

const urlParams = (page = 1, querySuffix = '', filterParams?: IParams) => {
  const searchFilterParams = new SearchFilterParams(filterParams);
  const suffixUri = querySuffix ? `&${querySuffix}` : '';
  return `?page=${page}${suffixUri}${searchFilterParams.toURI()}`;
};

const First: React.FC<IProps> = ({
  querySuffix,
  currentPage,
  compact,
  searchFilterParams,
}) => (
  <li>
    <a
      className="fr-pagination__link fr-pagination__link--first fr-pagination__link--lg-label"
      href={
        currentPage > 1
          ? urlParams(1, querySuffix, searchFilterParams)
          : undefined
      }
    >
      {compact ? '' : 'Première page'}
    </a>
  </li>
);

const Last: React.FC<IProps> = ({
  currentPage,
  querySuffix,
  totalPages,
  compact,
  searchFilterParams,
}) => (
  <li>
    <a
      className="fr-pagination__link fr-pagination__link--last"
      href={
        currentPage < totalPages
          ? urlParams(totalPages, querySuffix, searchFilterParams)
          : undefined
      }
    >
      {compact ? '' : 'Dernière page'}
    </a>
  </li>
);
const Previous: React.FC<IProps> = ({
  currentPage,
  querySuffix,
  searchFilterParams,
  compact,
}) => (
  <li>
    <a
      className="fr-pagination__link fr-pagination__link--prev fr-pagination__link--lg-label"
      href={
        currentPage > 1
          ? urlParams(currentPage - 1, querySuffix, searchFilterParams)
          : undefined
      }
    >
      {compact ? '' : 'Page précédente'}
    </a>
  </li>
);

const Next: React.FC<IProps> = ({
  currentPage,
  querySuffix,
  totalPages,
  searchFilterParams,
  compact,
}) => (
  <li>
    <a
      className="fr-pagination__link fr-pagination__link--next fr-pagination__link--lg-label"
      href={
        currentPage < totalPages
          ? urlParams(currentPage + 1, querySuffix, searchFilterParams)
          : undefined
      }
    >
      {compact ? '' : 'Page suivante'}
    </a>
  </li>
);

const Page: React.FC<{
  pageNum: number;
  querySuffix?: string;
  currentPage: number;
  searchFilterParams?: IParams;
}> = ({ pageNum, querySuffix, currentPage, searchFilterParams }) => (
  <li>
    <a
      href={urlParams(pageNum, querySuffix, searchFilterParams)}
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
const PageCounter: React.FC<IProps> = ({
  currentPage,
  querySuffix,
  totalPages,
  searchFilterParams,
  compact = false,
}) => {
  const pages = pagesArray(currentPage, totalPages);
  if (pages.length === 1) {
    return null;
  }

  return (
    <div className="layout-center">
      <nav role="navigation" className="fr-pagination" aria-label="Pagination">
        <ul className="fr-pagination__list">
          <First
            currentPage={currentPage}
            querySuffix={querySuffix}
            totalPages={totalPages}
            compact={compact}
            searchFilterParams={searchFilterParams}
          />
          <Previous
            currentPage={currentPage}
            querySuffix={querySuffix}
            totalPages={totalPages}
            compact={compact}
            searchFilterParams={searchFilterParams}
          />
          {pages.map((pageNum) => {
            return (
              <Page
                searchFilterParams={searchFilterParams}
                currentPage={currentPage}
                querySuffix={querySuffix}
                pageNum={pageNum}
                key={pageNum}
              />
            );
          })}
          <Next
            currentPage={currentPage}
            querySuffix={querySuffix}
            compact={compact}
            totalPages={totalPages}
            searchFilterParams={searchFilterParams}
          />
          <Last
            currentPage={currentPage}
            compact={compact}
            querySuffix={querySuffix}
            totalPages={totalPages}
            searchFilterParams={searchFilterParams}
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

export default PageCounter;
