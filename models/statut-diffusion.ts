import { isLoggedIn } from '#utils/session';
import { ISession } from '#utils/session';
import { IEtablissement, IUniteLegale } from '.';

export enum ISTATUTDIFFUSION {
  PARTIAL = 'partiellement diffusible',
  NONDIFF = 'non-diffusible',
  DIFFUSIBLE = 'diffusible',
}

/**
 * Only diffusible. Exclude partially diffusible and non-diffusible
 * @param uniteLegaleOrEtablissement
 * @returns
 */
export const estDiffusible = (uniteLegaleOrEtablissement: {
  statutDiffusion: ISTATUTDIFFUSION;
}) => {
  return (
    uniteLegaleOrEtablissement.statutDiffusion === ISTATUTDIFFUSION.DIFFUSIBLE
  );
};

/**
 * Only strict non-diffusible. Exclude partially diffusible and diffusible
 * @param uniteLegaleOrEtablissement
 * @returns
 */
export const estNonDiffusible = (uniteLegaleOrEtablissement: {
  statutDiffusion: ISTATUTDIFFUSION;
}) => {
  return (
    uniteLegaleOrEtablissement.statutDiffusion === ISTATUTDIFFUSION.NONDIFF
  );
};

export const nonDiffusibleDataFormatter = (e: string) =>
  `▪︎ ▪︎ ▪︎ ${e} ▪︎ ▪︎ ▪︎`;

/**
 * Return full name depending on diffusibility status (https://www.insee.fr/fr/information/6683782)
 * @param uniteLegale
 * @returns
 */
export const getNomComplet = (
  uniteLegale: IUniteLegale,
  session: ISession | null
) => {
  if (session && isLoggedIn(session)) {
    return uniteLegale.nomComplet;
  }

  if (uniteLegale.complements.estEntrepreneurIndividuel) {
    if (estDiffusible(uniteLegale)) {
      return uniteLegale.nomComplet;
    }
    return nonDiffusibleDataFormatter('information non-diffusible');
  } else {
    if (estNonDiffusible(uniteLegale)) {
      return nonDiffusibleDataFormatter('information non-diffusible');
    }

    return uniteLegale.nomComplet;
  }
};

const formatAdresseForDiffusion = (
  estDiffusible: boolean,
  adresse: string,
  commune: string,
  codePostal: string
) => {
  if (estDiffusible) {
    return adresse || 'Adresse inconnue';
  }

  if (!commune && !codePostal) {
    return nonDiffusibleDataFormatter('information non-diffusible');
  }
  return nonDiffusibleDataFormatter(`${codePostal} ${commune}`);
};

/**
 * Return adresse depending on diffusibility status (https://www.insee.fr/fr/information/6683782)
 * @param uniteLegale
 * @returns
 */
export const getAdresseUniteLegale = (
  uniteLegale: IUniteLegale,
  session: ISession | null,
  postale = false
) => {
  const { adressePostale, adresse, commune, codePostal } =
    uniteLegale?.siege || {};

  const shouldDiff =
    session && isLoggedIn(session) ? true : estDiffusible(uniteLegale);

  return formatAdresseForDiffusion(
    shouldDiff,
    postale ? adressePostale : adresse,
    commune,
    codePostal
  );
};

/**
 * Return adresse depending on diffusibility status (https://www.insee.fr/fr/information/6683782)
 * @param uniteLegale
 * @returns
 */
export const getAdresseEtablissement = (
  etablissement: IEtablissement,
  session: ISession | null,
  postale = false
) => {
  const { adressePostale, adresse, commune, codePostal } = etablissement || {};

  const shouldDiff =
    session && isLoggedIn(session) ? true : estDiffusible(etablissement);

  return formatAdresseForDiffusion(
    shouldDiff,
    postale ? adressePostale : adresse,
    commune,
    codePostal
  );
};

/**
 * Return adresse depending on diffusibility status (https://www.insee.fr/fr/information/6683782)
 * @param uniteLegale
 * @returns
 */
export const getCoordsEtablissement = (etablissement: IEtablissement) => {
  const defaultLat = '47.394144';
  const defaultLong = '0.68484';

  const { latitude = defaultLat, longitude = defaultLong } =
    etablissement || {};

  if (!estDiffusible(etablissement)) {
    try {
      const long = parseFloat(longitude).toFixed(2);
      const lat = parseFloat(latitude).toFixed(2);
      return [long, lat];
    } catch {
      return [defaultLong, defaultLat];
    }
  }

  return [etablissement.longitude, etablissement.latitude];
};
