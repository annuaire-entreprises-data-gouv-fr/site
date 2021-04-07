import React from 'react';

interface IProps {
  currentPage: number;
  querySuffix?: string;
  totalPages: number;
}

const pagesArray = (currentPage: number, totalPages: number): number[] => {
  if (totalPages <= 10) {
    //@ts-ignore
    return [...Array(totalPages).keys()];
  }

  if (currentPage + 5 >= totalPages) {
    //@ts-ignore
    return [...Array(10).keys()].map((i) => i + totalPages - 9);
  }

  //@ts-ignore
  return [...Array(10).keys()].map((i) => i + Math.max(0, currentPage - 5));
};

const PageCounter: React.FC<IProps> = ({
  currentPage,
  querySuffix,
  totalPages,
}) => (
  <>
    {totalPages && totalPages > 1 ? (
      <div className="pages-selector">
        {currentPage !== 1 && (
          <a
            href={`?page=${currentPage - 1}${
              querySuffix ? `&${querySuffix}` : ''
            }`}
          >
            ⇠ <span>précédente</span>
          </a>
        )}
        <div>
          {/* @ts-ignore */}
          {pagesArray(currentPage, totalPages + 1).map((pageNum) => {
            return (
              <a
                href={`?page=${pageNum + 1}${
                  querySuffix ? `&${querySuffix}` : ''
                }`}
                className={`${currentPage === pageNum + 1 ? 'active' : ''}`}
                key={pageNum}
              >
                {pageNum + 1}
              </a>
            );
          })}
        </div>
        {currentPage !== totalPages + 1 && (
          <a
            href={`?page=${currentPage + 1}${
              querySuffix ? `&${querySuffix}` : ''
            }`}
          >
            <span>suivante</span> ⇢
          </a>
        )}

        <style jsx>{`
          .pages-selector {
            width: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 20px 0;
          }
          .pages-selector > div {
            display: flex;
            margin: 0 30px;
          }
          .pages-selector > div > a {
            border-radius: 3px;
            padding: 0 5px;
            margin: 0 3px;
            box-shadow: none;
          }
          .pages-selector > div > a.active {
            border: 1px solid #000091;
          }
          @media only screen and (min-width: 1px) and (max-width: 900px) {
            .pages-selector > a > span {
              display: none;
            }
          }
        `}</style>
      </div>
    ) : null}
  </>
);

export default PageCounter;
