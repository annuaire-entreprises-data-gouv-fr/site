import { isIdRnfValid } from './id-rnf';

describe('Check isIdRna', () => {
  test('Succeed with valid RNF', () => {
    expect(isIdRnfValid('075-FDD-00003-01')).toBe(true);
  });
  test('Fails with invalid RNA', () => {
    expect(isIdRnfValid('97-184')).toBe(false);
    expect(isIdRnfValid('353019855')).toBe(false);
    expect(isIdRnfValid('37_2304')).toBe(false);
  });
});

export {};
