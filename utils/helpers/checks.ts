import { IUniteLegale } from '#models/index';

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

export const isAssociationFromNatureJuridique = (natureJuridique = '') =>
  natureJuridique === '5195' || natureJuridique.indexOf('92') === 0;

export const isServicePublicFromNatureJuridique = (natureJuridique = '') =>
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
  if (!uniteLegale.estActive) {
    // we dont index closed entities
    return true;
  }
  if (!uniteLegale.estDiffusible) {
    // we dont index non diffusible
    return true;
  }
  if (!uniteLegale.estEntrepriseCommercialeDiffusible) {
    // we dont index entreprise that personnaly opposed diffusion
    return true;
  }
  return false;
};
