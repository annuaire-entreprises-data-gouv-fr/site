import { estActif } from '#models/etat-administratif';
import { IUniteLegale } from '#models/index';
import { estDiffusible, ISTATUTDIFFUSION } from '#models/statut-diffusion';

export const isEntrepreneurIndividuelFromNatureJuridique = (
  natureJuridique: string
) => ['1', '10', '1000'].indexOf(natureJuridique) > -1;

export const isTwoMonthOld = (dateAsString: string) => {
  try {
    const date = new Date(dateAsString);
    const timeDifference = new Date().getTime() - date.getTime();

    return Math.round(timeDifference / (3600 * 24 * 1000)) > 60;
  } catch {
    return false;
  }
};

export const isAssociationFromNatureJuridique = (natureJuridique: string) =>
  natureJuridique === '5195' || natureJuridique.indexOf('92') === 0;

export const isServicePublicFromNatureJuridique = (natureJuridique: string) =>
  natureJuridique === '3210' ||
  natureJuridique === '3110' ||
  natureJuridique.indexOf('4') === 0 ||
  natureJuridique.indexOf('71') === 0 ||
  natureJuridique.indexOf('72') === 0 ||
  natureJuridique.indexOf('73') === 0 ||
  natureJuridique.indexOf('74') === 0;

/**
 * Return true if an uniteLegale should be **ignored** by indexing bots
 */
export const shouldNotIndex = (uniteLegale: IUniteLegale) => {
  if (uniteLegale.complements.estEntrepreneurIndividuel) {
    // we dont index EI
    return true;
  }
  if (!estActif(uniteLegale)) {
    // we dont index closed entities
    return true;
  }
  if (!estDiffusible(uniteLegale)) {
    // we dont index non diffusible or partially diffusible
    return true;
  }
  return false;
};
