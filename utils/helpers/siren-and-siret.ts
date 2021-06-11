/**
 * Siren and siret types
 */
type Brand<K, T> = K & { __brand: T };

export type Siren = Brand<string, 'Siren'>;
export type Siret = Brand<string, 'Siren'>;

export const isSiren = (slug: string): slug is Siren => {
  if (!hasSirenFormat(slug) || !isLuhnValid(slug)) {
    return false;
  }
  return true;
};

export const isSiret = (slug: string): slug is Siren => {
  if (!hasSiretFormat(slug) || !isLuhnValid(slug)) {
    return false;
  }
  return true;
};

/**
 * Siren and siret follow the luhn checksum algorithm except La Poste
 * https://fr.wikipedia.org/wiki/Formule_de_Luhn
 * ex : 889742876 00009 dos not follow Luhn's rule
 *
 * @param siret
 * @returns
 */
const luhnChecksum = (str: string) => {
  return Array.from(str)
    .reverse()
    .map((character, charIdx) => {
      const num = parseInt(character, 10);
      const isIndexEven = (charIdx + 1) % 2 === 0;
      return isIndexEven ? num * 2 : num;
    })
    .reduce((checksum: number, num: number) => {
      const val = num >= 10 ? num - 9 : num;
      return checksum + val;
    }, 0);
};

export const isLuhnValid = (str: string) => {
  // La poste siren and siret are the only exceptions to Luhn's formula
  if (str.indexOf('356000000') === 0) {
    return true;
  }
  return luhnChecksum(str) % 10 == 0;
};

export const isLikelyASiretOrSiren = (slug: string) => {
  return hasSirenFormat(slug) || hasSiretFormat(slug);
};

export const hasSirenFormat = (str: string) => !!str.match(/^\d{9}$/g);

export const hasSiretFormat = (str: string) => !!str.match(/^\d{14}$/g);

export const formatSiret = (siret = '') => {
  return siret.replace(/(\d{3})/g, '$1 ').replace(/(\s)(?=(\d{2})$)/g, '');
};

export const extractSirenFromSiret = (siret: string) => {
  return siret.slice(0, 9);
};

export const extractNicFromSiret = (siret: string) => {
  return siret.slice(9);
};
