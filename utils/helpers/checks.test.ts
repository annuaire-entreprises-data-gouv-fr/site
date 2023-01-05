import { IETATADMINSTRATIF } from '#models/etat-administratif';
import { ISTATUTDIFFUSION } from '#models/statut-diffusion';
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
    u.etatAdministratif = IETATADMINSTRATIF.ACTIF;
    u.complements.estEntrepreneurIndividuel = false;
    expect(shouldNotIndex(u)).toBe(false);
  });
  test('EI fails', () => {
    const u = createDefaultUniteLegale('000000000' as Siren);
    u.complements.estEntrepreneurIndividuel = true;
    expect(shouldNotIndex(u)).toBe(true);
  });
  test('Closed succeed', () => {
    const u = createDefaultUniteLegale('000000000' as Siren);
    u.etatAdministratif = IETATADMINSTRATIF.CESSEE;
    expect(shouldNotIndex(u)).toBe(true);
  });
  test('NonDiffusible succeed', () => {
    const u = createDefaultUniteLegale('000000000' as Siren);
    u.statutDiffusion = ISTATUTDIFFUSION.NONDIFF;
    expect(shouldNotIndex(u)).toBe(true);
  });
  test('PartiallyDiffusible succeed', () => {
    const u = createDefaultUniteLegale('000000000' as Siren);
    u.statutDiffusion = ISTATUTDIFFUSION.PARTIAL;
    expect(shouldNotIndex(u)).toBe(true);
  });
});

export {};
