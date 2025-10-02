import { shouldAddNoIndex } from './noindex-query-params';

describe('shouldAddNoIndex', () => {
  it('should return false when searchParams is null', () => {
    expect(shouldAddNoIndex(null)).toBe(false);
  });

  it('should return false when searchParams is empty', () => {
    expect(shouldAddNoIndex({})).toBe(false);
  });

  it('should return false when searchParams contains only non-problematic parameters', () => {
    const searchParams = {
      q: 'search term',
      page: '1',
      sort: 'relevance',
      category: 'business',
    };
    expect(shouldAddNoIndex(searchParams)).toBe(false);
  });

  it('should return true when searchParams contains pathFrom parameter', () => {
    const searchParams = {
      pathFrom: '/previous-page',
      q: 'search term',
    };
    expect(shouldAddNoIndex(searchParams)).toBe(true);
  });

  it('should return true when searchParams contains redirected parameter', () => {
    const searchParams = {
      redirected: 'true',
      q: 'search term',
    };
    expect(shouldAddNoIndex(searchParams)).toBe(true);
  });

  it('should return true when searchParams contains isABot parameter', () => {
    const searchParams = {
      isABot: 'true',
      q: 'search term',
    };
    expect(shouldAddNoIndex(searchParams)).toBe(true);
  });

  it('should return true when searchParams contains multiple problematic parameters', () => {
    const searchParams = {
      pathFrom: '/previous-page',
      redirected: 'true',
      isABot: 'false',
      q: 'search term',
    };
    expect(shouldAddNoIndex(searchParams)).toBe(true);
  });
});
