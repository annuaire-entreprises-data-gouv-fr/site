import { capitalize } from '../../../../utils/helpers/formatting';

export const cleanTextFromHtml = (raw = '') =>
  raw.replace('\n', '').replace(/\s+/g, ' ').trim();

/**
 * converts a html block of two adjacents <p> into a {label, text }
 * @param block
 * @returns
 */
export const extractFromHtmlBlock = (block: Element) => {
  const label = cleanTextFromHtml(
    block.querySelector('p:first-of-type')?.innerHTML
  );

  const text = cleanTextFromHtml(
    block.querySelector('p:last-of-type')?.innerHTML
  );
  return { label, text };
};

/**
 * Extract name and roles from a string, following INPI formating of "name surname" using only the first word as family name
 * Role is optionnal
 * @param rawNameAndRole
 * @returns
 */
export const parseNameAndRole = (rawNameAndRole = '') => {
  const response = {
    nom: null,
    prenom: null,
    role: null,
  } as any;

  if (!rawNameAndRole) {
    return response;
  }

  const nameAndRole = rawNameAndRole
    .replaceAll('\n', '')
    .replaceAll(/\s+/g, ' ')
    .replaceAll('<br>', ' ')
    .replace(')', '')
    .split('(')
    .map((word) => word.trim());

  response.role = nameAndRole.length > 1 ? nameAndRole[1] : '';

  response.nom = (nameAndRole[0] || '')
    .split(' ')
    .map((w) => capitalize(w))
    .join(' ');

  response.prenom = '';

  return response;
};
