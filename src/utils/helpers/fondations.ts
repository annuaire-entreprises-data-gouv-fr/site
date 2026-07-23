import { NotAnIdRnfError } from "#/models/core/fondations.types";

const ID_RNF_REGEX = /^\d{3}-(FE|FDD|FRUP)-\d{5}-\d{2}$/;

export const isIdRnf = (slug: string): boolean => ID_RNF_REGEX.test(slug);

export const verifyIdRnf = (slug: string): string => {
  if (!isIdRnf(slug)) {
    throw new NotAnIdRnfError(slug);
  }
  return slug;
};
