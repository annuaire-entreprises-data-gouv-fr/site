import { isIdRna } from './id-rna';

describe('Check isIdRna', () => {
  test('Succeed with valid RNA', () => {
    expect(isIdRna('W751245606')).toBe(true);
    expect(isIdRna('0653005592')).toBe(true);
  });
  test('Fails with invalid RNA', () => {
    expect(isIdRna('97-184')).toBe(false);
    expect(isIdRna('353019855')).toBe(false);
    expect(isIdRna('37_2304')).toBe(false);
  });
});

export {};
