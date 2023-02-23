import { NotAValidIdRnaError } from '#models/index';

/**
 * IdRna types
 */
type Brand<K, T> = K & { __brand: T };

export type IdRna = Brand<string, 'IdRna'>;

/**
 * Two valid Id RNA format
 */
const matchFormatA = (str: string) => !!str.match(/^W\d[A-Z0-9]\d{7}$/);
const matchFormatB = (str: string) => !!str.match(/^0\d{3}0{2}\d{4}$/);

export const isIdRna = (slug: string): slug is IdRna => {
  if (matchFormatA(slug) || matchFormatB(slug)) {
    return true;
  }
  return false;
};

/**
 * Throw an exception if a string is not a siret
 * */
export const verifyIdRna = (slug: string): IdRna => {
  if (!slug || !isIdRna(slug)) {
    throw new NotAValidIdRnaError(slug);
  }
  return slug;
};
