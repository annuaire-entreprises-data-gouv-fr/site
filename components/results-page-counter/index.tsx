import React from 'react';

interface IProps {
  currentPage: number;
  querySuffix?: string;
  totalPages: number;
  compact?: boolean;
}

export const pagesArray = (
  currentPage: number,
  totalPages: number
): number[] => {
  let from = Math.max(1, currentPage - 5);
  let to = Math.min(totalPages, currentPage + 5);

  const pages = [];
  for (let page = from; page <= to; page++) {
    pages.push(page);
  }

  return pages;
};

const First: React.FC<IProps> = ({ querySuffix, currentPage, compact }) => (
  <li>
    <a
      className="fr-pagination__link fr-pagination__link--first fr-pagination__link--lg-label"
      href={
        currentPage > 1
          ? `?page=${1}${querySuffix ? `&${querySuffix}` : ''}`
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
}) => (
  <li>
    <a
      className="fr-pagination__link fr-pagination__link--last"
      href={
        currentPage < totalPages
          ? `?page=${totalPages}${querySuffix ? `&${querySuffix}` : ''}`
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
  totalPages,
  compact,
}) => (
  <li>
    <a
      className="fr-pagination__link fr-pagination__link--prev fr-pagination__link--lg-label"
      href={
        currentPage > 1
          ? `?page=${currentPage - 1}${querySuffix ? `&${querySuffix}` : ''}`
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
  compact,
}) => (
  <li>
    <a
      className="fr-pagination__link fr-pagination__link--next fr-pagination__link--lg-label"
      href={
        currentPage < totalPages
          ? `?page=${currentPage + 1}${querySuffix ? `&${querySuffix}` : ''}`
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
}> = ({ pageNum, querySuffix, currentPage }) => (
  <li>
    <a
      href={`?page=${pageNum}${querySuffix ? `&${querySuffix}` : ''}`}
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
          />
          <Previous
            currentPage={currentPage}
            querySuffix={querySuffix}
            totalPages={totalPages}
            compact={compact}
          />
          {pages.map((pageNum) => {
            return (
              <Page
                key={pageNum}
                currentPage={currentPage}
                querySuffix={querySuffix}
                pageNum={pageNum}
              />
            );
          })}
          <Next
            currentPage={currentPage}
            querySuffix={querySuffix}
            compact={compact}
            totalPages={totalPages}
          />
          <Last
            currentPage={currentPage}
            compact={compact}
            querySuffix={querySuffix}
            totalPages={totalPages}
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
