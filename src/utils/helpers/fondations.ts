import { NotAnIdRnfError } from "#/models/core/fondations.types";

// TODO real check with regex
export const isIdRnf = (slug: string): boolean => slug.length === 10;

export const verifyIdRnf = (slug: string): string => {
  if (!isIdRnf(slug)) {
    throw new NotAnIdRnfError(slug);
  }
  return slug;
};
