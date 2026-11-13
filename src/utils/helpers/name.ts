const DIACRITICS_REGEX = /\p{Diacritic}/gu;
const NON_ALPHANUMERIC_REGEX = /[^\p{Letter}\p{Number}]/gu;

export const normalizeName = (value: string | null | undefined) =>
  (value ?? "")
    .normalize("NFD")
    .replace(DIACRITICS_REGEX, "")
    .toLocaleLowerCase("fr-FR")
    .replaceAll("œ", "oe")
    .replaceAll("æ", "ae")
    .replace(NON_ALPHANUMERIC_REGEX, "");
