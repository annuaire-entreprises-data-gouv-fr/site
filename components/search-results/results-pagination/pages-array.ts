export const pagesArray = (
  currentPage: number,
  totalPages: number
): number[] => {
  const from = Math.max(1, currentPage - 5);
  const to = Math.min(totalPages, currentPage + 5);

  const pages = [];
  for (let page = from; page <= to; page++) {
    pages.push(page);
  }

  return pages;
};

export default pagesArray;
