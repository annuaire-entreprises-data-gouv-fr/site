import React from 'react';
import pagesArray from './pages-array';

type IProps = {
  currentPage: number;
  totalPages: number;
  compact?: boolean;
  onPageChange: (page: number) => void;
};

const First: React.FC<IProps> = ({ currentPage, compact, onPageChange }) => (
  <li>
    <button
      className="fr-pagination__link fr-pagination__link--first fr-pagination__link--lg-label"
      onClick={() => currentPage > 1 && onPageChange(1)}
      disabled={currentPage <= 1}
    >
      {compact ? '' : 'Première page'}
    </button>
  </li>
);

const Last: React.FC<IProps> = ({
  currentPage,
  totalPages,
  compact,
  onPageChange,
}) => (
  <li>
    <button
      className="fr-pagination__link fr-pagination__link--last"
      onClick={() => currentPage < totalPages && onPageChange(totalPages)}
      disabled={currentPage >= totalPages}
    >
      {compact ? '' : 'Dernière page'}
    </button>
  </li>
);

const Previous: React.FC<IProps> = ({ currentPage, compact, onPageChange }) => (
  <li>
    <button
      className="fr-pagination__link fr-pagination__link--prev fr-pagination__link--lg-label"
      onClick={() => currentPage > 1 && onPageChange(currentPage - 1)}
      disabled={currentPage <= 1}
    >
      {compact ? '' : 'Page précédente'}
    </button>
  </li>
);

const Next: React.FC<IProps> = ({
  currentPage,
  totalPages,
  compact,
  onPageChange,
}) => (
  <li>
    <button
      className="fr-pagination__link fr-pagination__link--next fr-pagination__link--lg-label"
      onClick={() => currentPage < totalPages && onPageChange(currentPage + 1)}
      disabled={currentPage >= totalPages}
    >
      {compact ? '' : 'Page suivante'}
    </button>
  </li>
);

const Page: React.FC<{
  pageNum: number;
  currentPage: number;
  onPageChange: (page: number) => void;
}> = ({ pageNum, currentPage, onPageChange }) => (
  <li>
    <button
      onClick={() => onPageChange(pageNum)}
      className="fr-pagination__link"
      aria-current={currentPage === pageNum ? 'page' : undefined}
      title={`Page ${pageNum}`}
    >
      {pageNum}
    </button>
  </li>
);

/**
 * Page counter component. Be careful as it is not zero-indexed. Pages starts at 1
 * @param param0
 * @returns
 */
const LocalPageCounter: React.FC<IProps> = ({
  currentPage,
  totalPages,
  onPageChange,
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
            totalPages={totalPages}
            compact={compact}
            onPageChange={onPageChange}
          />
          <Previous
            currentPage={currentPage}
            totalPages={totalPages}
            compact={compact}
            onPageChange={onPageChange}
          />
          {pages.map((pageNum) => {
            return (
              <Page
                currentPage={currentPage}
                pageNum={pageNum}
                onPageChange={onPageChange}
                key={pageNum}
              />
            );
          })}
          <Next
            currentPage={currentPage}
            compact={compact}
            totalPages={totalPages}
            onPageChange={onPageChange}
          />
          <Last
            currentPage={currentPage}
            compact={compact}
            totalPages={totalPages}
            onPageChange={onPageChange}
          />
        </ul>
      </nav>
    </div>
  );
};

export default LocalPageCounter;
