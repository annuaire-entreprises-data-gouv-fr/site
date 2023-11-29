import { getFiscalYear } from './format-fiscal-year';

describe('Check formatFiscalYear', () => {
  test('Previous year', () => {
    expect(getFiscalYear('2020-05-01')).toBe(2019);
    expect(getFiscalYear('2020-01-01')).toBe(2019);
  });
  test('Current year', () => {
    expect(getFiscalYear('2020-09-01')).toBe(2020);
    expect(getFiscalYear('2020-12-31')).toBe(2020);
  });
});

export {};
