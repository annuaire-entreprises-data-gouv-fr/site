import { IUniteLegale } from '../../models';

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
  ['92', '5195', '9210', '9220', '9221', '9222', '9230', '9260'].indexOf(
    natureJuridique
  ) > -1;

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
