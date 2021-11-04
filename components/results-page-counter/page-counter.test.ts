import pagesArray from './pages-array';

describe('Check page counter helper', () => {
  test('Works with few pages', () => {
    const pages = pagesArray(1, 2);
    expect(pages).toStrictEqual([1, 2]);
  });

  test('Works with many pages', () => {
    const pages = pagesArray(5, 20);
    expect(pages).toStrictEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
  });

  test('Works with current page 0', () => {
    const pages = pagesArray(0, 20);
    expect(pages).toStrictEqual([1, 2, 3, 4, 5]);
  });
  test('Works with current page = total page', () => {
    const pages = pagesArray(20, 20);
    expect(pages).toStrictEqual([15, 16, 17, 18, 19, 20]);
  });

  test('Works with many pages and high current page', () => {
    const pages = pagesArray(29, 30);
    expect(pages).toStrictEqual([24, 25, 26, 27, 28, 29, 30]);
  });

  test('Works with one page', () => {
    const pages = pagesArray(1, 1);
    expect(pages).toStrictEqual([1]);
  });

  test('Works with stupid stuff', () => {
    const pages = pagesArray(1, 0);
    expect(pages).toStrictEqual([]);
  });
});

export {};
