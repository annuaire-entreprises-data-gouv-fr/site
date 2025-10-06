import type React from "react";
import pagesArray from "./pages-array";

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
      disabled={currentPage <= 1}
      onClick={() => currentPage > 1 && onPageChange(1)}
    >
      {compact ? "" : "Première page"}
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
      disabled={currentPage >= totalPages}
      onClick={() => currentPage < totalPages && onPageChange(totalPages)}
    >
      {compact ? "" : "Dernière page"}
    </button>
  </li>
);

const Previous: React.FC<IProps> = ({ currentPage, compact, onPageChange }) => (
  <li>
    <button
      className="fr-pagination__link fr-pagination__link--prev fr-pagination__link--lg-label"
      disabled={currentPage <= 1}
      onClick={() => currentPage > 1 && onPageChange(currentPage - 1)}
    >
      {compact ? "" : "Page précédente"}
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
      disabled={currentPage >= totalPages}
      onClick={() => currentPage < totalPages && onPageChange(currentPage + 1)}
    >
      {compact ? "" : "Page suivante"}
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
      aria-current={currentPage === pageNum ? "page" : undefined}
      className="fr-pagination__link"
      onClick={() => onPageChange(pageNum)}
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
    <div className="layout-center" style={{ margin: "15px auto" }}>
      <nav aria-label="Pagination" className="fr-pagination" role="navigation">
        <ul className="fr-pagination__list">
          <First
            compact={compact}
            currentPage={currentPage}
            onPageChange={onPageChange}
            totalPages={totalPages}
          />
          <Previous
            compact={compact}
            currentPage={currentPage}
            onPageChange={onPageChange}
            totalPages={totalPages}
          />
          {pages.map((pageNum) => (
            <Page
              currentPage={currentPage}
              key={pageNum}
              onPageChange={onPageChange}
              pageNum={pageNum}
            />
          ))}
          <Next
            compact={compact}
            currentPage={currentPage}
            onPageChange={onPageChange}
            totalPages={totalPages}
          />
          <Last
            compact={compact}
            currentPage={currentPage}
            onPageChange={onPageChange}
            totalPages={totalPages}
          />
        </ul>
      </nav>
    </div>
  );
};

export default LocalPageCounter;
