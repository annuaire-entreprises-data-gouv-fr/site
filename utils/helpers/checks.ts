import { estActif } from '#models/etat-administratif';
import { IUniteLegale } from '#models/index';
import { estDiffusible } from '#models/statut-diffusion';

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
