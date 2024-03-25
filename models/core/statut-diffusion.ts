import { ISession } from '#models/user/session';
import { IEtablissement, IUniteLegale } from './types';

export enum ISTATUTDIFFUSION {
  PROTECTED = 'partiellement diffusible',
  PARTIAL = 'partiellement diffusible',
  NONDIFF = 'non-diffusible',
  DIFFUSIBLE = 'diffusible',
}

const canSeeNonDiffusible = (session: ISession | null) =>
  session?.rights.nonDiffusible;

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

export const defaultNonDiffusiblePlaceHolder = nonDiffusibleDataFormatter(
  'information non-diffusible'
);

/**
 * Return full name depending on diffusibility status (https://www.insee.fr/fr/information/6683782)
 * @param uniteLegale
 * @returns
 */
export const getNomComplet = (
  uniteLegale: IUniteLegale,
  session: ISession | null
) => {
  if (session && canSeeNonDiffusible(session)) {
    return uniteLegale.nomComplet;
  }

  if (uniteLegale.complements.estEntrepreneurIndividuel) {
    if (estDiffusible(uniteLegale)) {
      return uniteLegale.nomComplet;
    }
    return defaultNonDiffusiblePlaceHolder;
  } else {
    if (!estDiffusible(uniteLegale)) {
      return defaultNonDiffusiblePlaceHolder;
    }

    return uniteLegale.nomComplet;
  }
};

export const getEnseigneEtablissement = (
  etablissement: IEtablissement,
  session: ISession | null
) => {
  if (!estDiffusible(etablissement) && !canSeeNonDiffusible(session)) {
    return defaultNonDiffusiblePlaceHolder;
  }
  return etablissement.enseigne;
};

export const getDenominationEtablissement = (
  etablissement: IEtablissement,
  session: ISession | null
) => {
  if (!estDiffusible(etablissement) && !canSeeNonDiffusible(session)) {
    return defaultNonDiffusiblePlaceHolder;
  }
  return etablissement.denomination;
};

export const getEtablissementName = (
  etablissement: IEtablissement,
  uniteLegale: IUniteLegale,
  session: ISession | null
) => {
  return (
    getEnseigneEtablissement(etablissement, session) ||
    getDenominationEtablissement(etablissement, session) ||
    getNomComplet(uniteLegale, session)
  );
};

const formatAdresseForDiffusion = (
  estDiffusible: boolean,
  adresse: string,
  commune: string
) => {
  if (estDiffusible) {
    return adresse || 'Adresse inconnue';
  }

  if (!commune) {
    return defaultNonDiffusiblePlaceHolder;
  }
  return nonDiffusibleDataFormatter(commune);
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
  const { adressePostale, adresse, commune } = uniteLegale?.siege || {};

  const shouldDiff = canSeeNonDiffusible(session)
    ? true
    : estDiffusible(uniteLegale);

  return formatAdresseForDiffusion(
    shouldDiff,
    postale ? adressePostale : adresse,
    commune
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
  const { adressePostale, adresse, commune } = etablissement || {};

  const shouldDiff = canSeeNonDiffusible(session)
    ? true
    : estDiffusible(etablissement);

  return formatAdresseForDiffusion(
    shouldDiff,
    postale ? adressePostale : adresse,
    commune
  );
};
