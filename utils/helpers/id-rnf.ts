import { NotAnIdRnfError } from '#models/index';

/**
 * IdRnf types
 */
type Brand<K, T> = K & { __brand: T };

export type IdRnf = Brand<string, 'IdRnf'>;

/**
 * Two valid Id RNF format
 */
const matchFormat = (str: string) =>
  !!str.match(/^0\d{2}-[a-zA-Z]{3}-\d{5}-\d{2}$/);

export const isIdRnfValid = (slug: string): slug is IdRnf => {
  if (matchFormat(slug)) {
    return true;
  }
  return false;
};

/**
 * Throw an exception if a string is not a RNF
 * */
export const verifyIdRnf = (slug: string): IdRnf => {
  if (!slug || !isIdRnfValid(slug)) {
    throw new NotAnIdRnfError(slug);
  }
  return slug;
};
