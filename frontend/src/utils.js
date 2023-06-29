/**
 * These are duplicates from /helpers as helpers uses typescript and we would rather use js to directly use these in browser
 * @param {*} url
 * @returns
 */

const extractSirenOrSiretSlugFromUrl = (url) => {
  if (!url) {
    return '';
  }
  // match a string that ends with either 9 digit or 14 like a siren or a siret
  // we dont use a $ end match as there might be " or %22 at the end
  const match = slug.match(/\d{14}|\d{9}/g);
  return match ? match[match.length - 1] : '';
};

export const extractSirenSlugFromUrl = (url) => {
  const sirenOrSiret = extractSirenOrSiretSlugFromUrl(url);
  if (sirenOrSiret.length > 9) {
    return sirenOrSiret.slice(0, 9);
  }
  return sirenOrSiret;
};

export const formatIntFr = (intAsString = '') => {
  try {
    return intAsString.replace(/(\d)(?=(\d{3})+$)/g, '$1 ');
  } catch {
    return intAsString;
  }
};
