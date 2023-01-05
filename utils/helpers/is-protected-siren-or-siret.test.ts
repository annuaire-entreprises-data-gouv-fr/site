import {
  isProtectedSiren,
  isProtectedSiret,
} from './is-protected-siren-or-siret';
import { verifySiren, verifySiret } from './siren-and-siret';

describe('Check isProtectedSiren and isProtectedSiret', () => {
  test('Siren', () => {
    expect(isProtectedSiren(verifySiren('880878145'))).toBe(false);
    expect(isProtectedSiren(verifySiren('908595879'))).toBe(true);
  });
  test('Siret', () => {
    expect(isProtectedSiret(verifySiret('88087814500015'))).toBe(false);
    expect(isProtectedSiret(verifySiret('90859587900010'))).toBe(true);
  });
});

export {};
