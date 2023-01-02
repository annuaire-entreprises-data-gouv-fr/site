import { readFileSync } from 'fs';
import { extractSirenFromSiret, Siren, Siret } from './siren-and-siret';

/**
 * List of siren whose owner refused diffusion
 */
class ProtectedSirenList {
  public _list: string[] = [];

  constructor() {
    this._list = readFileSync('public/protected-siren.txt', 'utf8').split('\n');
  }
}

const protectedSiren = new ProtectedSirenList();

export const isProtectedSiren = (siren: Siren) =>
  protectedSiren._list.indexOf(siren) > -1;

export const isProtectedSiret = (siret: Siret) => {
  const siren = extractSirenFromSiret(siret);
  return protectedSiren._list.indexOf(siren) > -1;
};
