function matchAllPolyfill(string, regex) {
  const matches = [];
  string.replace(regex, (...args) => {
    const matchArray = args.slice(0, -2);
    matches.push(matchArray);
    return args[0];
  });
  return matches;
}
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
  const matches = matchAllPolyfill(url, /\d{14}|\d{9}/g);
  const m = Array.from(matches, (m) => m[0]);
  if (m && m.length > 0) {
    return m[m.length - 1]; // last occurence of match
  }
  return '';
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
