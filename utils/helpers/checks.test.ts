import { createDefaultUniteLegale } from '../../models';
import {
  isEntrepreneurIndividuelFromNatureJuridique,
  shouldNotIndex,
} from './checks';
import { Siren } from './siren-and-siret';

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

describe('Check shouldIndex', () => {
  test('Standard fails', () => {
    const u = createDefaultUniteLegale('000000000' as Siren);
    u.estActive = true;
    expect(shouldNotIndex(u)).toBe(false);
  });
  test('Closed succeed', () => {
    const u = createDefaultUniteLegale('000000000' as Siren);
    u.estDiffusible = false;
    expect(shouldNotIndex(u)).toBe(true);
  });
  test('NonDiffusible succeed', () => {
    const u = createDefaultUniteLegale('000000000' as Siren);
    u.estActive = false;
    expect(shouldNotIndex(u)).toBe(true);
  });
});

export {};
