import {
  NotASirenError,
  NotASiretError,
  NotLuhnValidSirenError,
  NotLuhnValidSiretError,
} from '#models/index';

/**
 * Siren and siret types
 */
type Brand<K, T> = K & { __brand: T };

export type TVANumber = Brand<string, 'TVANumber'>;

export const isTVANumber = (slug: string): slug is TVANumber => {
  return !!slug.match(/^\d{11}$/g);
};

/**
 * throw an exception if a string is not a TVA Number
 * */
export const verifyTVANumber = (slug: string): TVANumber => {
  if (!isTVANumber(slug)) {
    throw new Error('Not a valid TVANumber');
  } else {
    return slug;
  }
};

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
 * throw an exception if a string is not a siren
 * */
export const verifySiren = (slug: string): Siren => {
  if (!isSiren(slug)) {
    if (!hasSirenFormat(slug)) {
      throw new NotASirenError(slug);
    } else {
      throw new NotLuhnValidSirenError(slug);
    }
  }
  return slug;
};

/**
 * Throw an exception if a string is not a siret
 * */
export const verifySiret = (slug: string): Siret => {
  if (!isSiret(slug)) {
    if (!hasSiretFormat(slug)) {
      throw new NotASiretError(slug);
    } else {
      throw new NotLuhnValidSiretError(slug);
    }
  }
  return slug;
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
  return luhnChecksum(str) % 10 === 0;
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
  return verifySiren(siret.slice(0, 9));
};
export const extractSirenFromSiretNoVerify = (siret: string): string => {
  return siret.slice(0, 9);
};

export const extractNicFromSiret = (siret: string) => {
  return siret.slice(9);
};

/**
 * Extract a siren/siret-like string from any url. Return empty string if nothing matches
 * @param slug
 * @returns
 */
export const extractSirenOrSiretSlugFromUrl = (slug: string) => {
  if (!slug) {
    return '';
  }
  // match a string that ends with either 9 digit or 14 like a siren or a siret
  // we dont use a $ end match as there might be " or %22 at the end
  const match = slug.match(/\d{14}|\d{9}/g);
  return match ? match[match.length - 1] : '';
};
