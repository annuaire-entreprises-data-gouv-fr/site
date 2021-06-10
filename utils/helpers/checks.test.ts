import { isEntrepreneurIndividuelFromNatureJuridique } from './checks';

describe('Check isEntrepreneurIndividuel', () => {
  test('Succeed with EI', () => {
    expect(isEntrepreneurIndividuelFromNatureJuridique('1')).toBe(true);
    expect(isEntrepreneurIndividuelFromNatureJuridique('10')).toBe(true);
    expect(isEntrepreneurIndividuelFromNatureJuridique('1000')).toBe(true);
  });
  test('Fails with other legal form', () => {
    expect(isEntrepreneurIndividuelFromNatureJuridique('99')).toBe(false);
    expect(isEntrepreneurIndividuelFromNatureJuridique('990000')).toBe(false);
    expect(isEntrepreneurIndividuelFromNatureJuridique('10000')).toBe(false);
    expect(isEntrepreneurIndividuelFromNatureJuridique('3')).toBe(false);
  });

  test('Fails with letters or empty string', () => {
    expect(isEntrepreneurIndividuelFromNatureJuridique('abc')).toBe(false);
    expect(isEntrepreneurIndividuelFromNatureJuridique('')).toBe(false);
  });
});

export {};
