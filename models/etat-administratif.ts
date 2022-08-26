import { IUniteLegale } from '.';
import logErrorInSentry from '../utils/sentry';

export enum IETATADMINSTRATIF {
  INCONNU = 'inconnu',
  ACTIF = 'en\u00a0activité',
  ACTIF_ZERO_ETABLISSEMENT = 'en\u00a0sommeil ou présumée\u00a0inactive',
  CESSEE = 'cessée',
  NONDIFF = 'état\u00a0inconnu (non-diffusible)',
  FERME = 'fermé',
}

/**
 * @param uniteLegale
 * @returns
 */
export const getEtatAdministratifUniteLegale = (uniteLegale: IUniteLegale) => {
  try {
    if (!uniteLegale.estDiffusible) {
      return IETATADMINSTRATIF.NONDIFF;
    }

    if (!uniteLegale.estActive) {
      return IETATADMINSTRATIF.CESSEE;
    }

    if (
      uniteLegale.estActive &&
      !(uniteLegale.etablissements.all || []).find((a) => a.estActif)
    ) {
      return IETATADMINSTRATIF.ACTIF_ZERO_ETABLISSEMENT;
    }

    return IETATADMINSTRATIF.ACTIF;
  } catch (e: any) {
    logErrorInSentry('Fail to determine Etat Administratif', {
      details: e,
      siren: uniteLegale.siren,
    });
    return IETATADMINSTRATIF.INCONNU;
  }
};

/**
 * @param estActif
 * @param estDiffusible
 * @returns
 */
export const getEtatAdministratifEtablissement = (
  estActif: boolean,
  estDiffusible: boolean
) => {
  if (!estDiffusible) {
    return IETATADMINSTRATIF.NONDIFF;
  }

  if (!estActif) {
    return IETATADMINSTRATIF.FERME;
  }

  return IETATADMINSTRATIF.ACTIF;
};

export const estActif = (etat: IETATADMINSTRATIF) =>
  etat === IETATADMINSTRATIF.ACTIF;
