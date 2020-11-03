import React from 'react';

interface IProps {
  currentPage: number;
  searchTerm: string;
  totalPages: number;
}

const pagesArray = (currentPage:number, totalPages:number) : number[] => {
  if (currentPage + 5 >= totalPages){
    //@ts-ignore
    return [...Array(10).keys()].map(i=>i+totalPages - 9);
  }

  //@ts-ignore
  return [...Array(10).keys()].map(i=>i+Math.max(0, currentPage-5))
}

const PageCounter: React.FC<IProps> = ({
  currentPage,
  searchTerm,
  totalPages,
}) => (
  <div className="pages-selector">
    {currentPage !== 1 && (
      <a href={`?terme=${searchTerm}&page=${currentPage - 1}`}>⇠ précédente</a>
    )}
    <div>
      {/* @ts-ignore */}
      {pagesArray(currentPage, totalPages + 1).map(
        (pageNum) => {
          return (
            <a
              href={`?terme=${searchTerm}&page=${pageNum + 1}`}
              className={`${currentPage === pageNum + 1 ? 'active' : ''}`}
              key={pageNum}
            >
              {pageNum + 1}
            </a>
          );
        }
      )}
    </div>
    {currentPage !== totalPages + 2 && (
      <a href={`?terme=${searchTerm}&page=${currentPage + 1}`}>suivante ⇢</a>
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
      }
      .pages-selector > div > a.active {
        border: 1px solid #000091;
      }
    `}</style>
  </div>
);

export default PageCounter;
