import { IETATADMINSTRATIF } from '#models/etat-administratif';
import { ISTATUTDIFFUSION } from '#models/statut-diffusion';
import {
  etatFromEtatAdministratifInsee,
  parseDateCreationInsee,
  statuDiffusionFromStatutDiffusionInsee,
} from '.';

describe('Check parseDateCreationInsee', () => {
  test('1900/01/01', () => {
    expect(parseDateCreationInsee('1900-01-01')).toBe('');
  });
  test('null', () => {
    expect(parseDateCreationInsee(null)).toBe('');
    expect(parseDateCreationInsee(undefined)).toBe('');
  });
  test('default', () => {
    expect(parseDateCreationInsee('2023-08-18')).toBe('2023-08-18');
  });
});

describe('Check statuDiffusionFromStatutDiffusionInsee', () => {
  test('Known statut', () => {
    expect(statuDiffusionFromStatutDiffusionInsee('O', '')).toBe(
      ISTATUTDIFFUSION.DIFFUSIBLE
    );
    expect(statuDiffusionFromStatutDiffusionInsee('N', '')).toBe(
      ISTATUTDIFFUSION.NONDIFF
    );
    expect(statuDiffusionFromStatutDiffusionInsee('P', '')).toBe(
      ISTATUTDIFFUSION.PARTIAL
    );
  });
});

describe('Check etatFromEtatAdministratifInsee', () => {
  test('Known etat', () => {
    expect(etatFromEtatAdministratifInsee('A', '')).toBe(
      IETATADMINSTRATIF.ACTIF
    );
    expect(etatFromEtatAdministratifInsee('C', '')).toBe(
      IETATADMINSTRATIF.CESSEE
    );
    expect(etatFromEtatAdministratifInsee('F', '')).toBe(
      IETATADMINSTRATIF.FERME
    );
  });
});
export {};
