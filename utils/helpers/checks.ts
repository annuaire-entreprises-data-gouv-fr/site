import { estNonDiffusibleStrict } from "#models/core/diffusion";
import { estActif } from "#models/core/etat-administratif";
import {
  type IEtablissement,
  type IUniteLegale,
  isPersonnePhysique,
} from "#models/core/types";

export const isEntrepreneurIndividuelFromNatureJuridique = (
  natureJuridique: string
) => ["1", "10", "1000"].indexOf(natureJuridique) > -1;

// Unités non dotées de la personnalité morale have a nature juridique starting with 2
const isSocietePersonnePhysiqueFromNatureJuridique = (
  natureJuridique: string | null
) => !!natureJuridique?.startsWith("2");

export const isPersonneMoraleFromNatureJuridique = (natureJuridique: string) =>
  !isEntrepreneurIndividuelFromNatureJuridique(natureJuridique) &&
  !isSocietePersonnePhysiqueFromNatureJuridique(natureJuridique);

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
export const shouldNotIndexUniteLegale = (uniteLegale: IUniteLegale) => {
  if (isPersonnePhysique(uniteLegale)) {
    // we dont index personnes physiques
    return true;
  }
  if (!estActif(uniteLegale)) {
    // we dont index closed entities
    return true;
  }
  if (estNonDiffusibleStrict(uniteLegale)) {
    // we dont index non diffusible strict
    return true;
  }
  return false;
};

/**
 * Return true if an etablissement should be **ignored** by indexing bots
 */
export const shouldNotIndexEtablissement = (etablissement: IEtablissement) => {
  if (isPersonnePhysique(etablissement)) {
    // we dont index personnes physiques
    return true;
  }
  if (!estActif(etablissement)) {
    // we dont index closed entities
    return true;
  }
  if (estNonDiffusibleStrict(etablissement)) {
    // we dont index non diffusible strict
    return true;
  }
  return false;
};
