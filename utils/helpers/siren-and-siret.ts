/**
 * Siren and siret follow the luhn checksum algorithm except La Poste
 * https://fr.wikipedia.org/wiki/Formule_de_Luhn
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

const isLuhnValid = (str: string) => {
  // La poste siren and siret are the only exceptions to Luhn's formula
  if (str.indexOf('356000000') === 0) {
    return true;
  }

  return luhnChecksum(str) % 10 == 0;
};

export const isSirenOrSiret = (str: string) => {
  return isSiren(str) || isSiret(str);
};

export const isSiret = (str: string) => {
  return str.match(/^\d{14}$/g) && isLuhnValid(str);
};

export const isSiren = (str: string) => {
  return str.match(/^\d{9}$/g) && isLuhnValid(str);
};

export const formatSiret = (siret = '') => {
  return siret.replace(/(\d{3})/g, '$1 ').replace(/(\s)(?=(\d{2})$)/g, '');
};

export const extractSirenFromSiret = (siret: string) => {
  return siret.slice(0, 9);
};

export const extractNicFromSiret = (siret: string) => {
  return siret.slice(9);
};
