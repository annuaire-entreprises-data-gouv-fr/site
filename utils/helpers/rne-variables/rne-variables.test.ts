import { getCapital, getDateFin } from '.';

describe('Check RNE variables helpers', () => {
  test('Succeeds with valid inputs', () => {
    expect(getDateFin(50, '1999-06-21')).toBe('21/06/2049');
  });

  test('Fails without a date or durée', () => {
    expect(getDateFin(0, '1999-06-21')).toBe('');
    expect(getDateFin(40, '')).toBe('');
    expect(getDateFin(40, null)).toBe('');
  });

  test('Succeeds with valid inputs', () => {
    expect(getCapital(10, '£', true)).toBe('10 £ (variable)');
    expect(getCapital(1000000, '€', false)).toBe('1000000 € (fixe)');
    expect(getCapital(10, 'POUNDS', true)).toBe('10 POUNDS (variable)');
  });
});

export {};
