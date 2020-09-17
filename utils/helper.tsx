import { concatNames } from './formatting';
import { categoriesJuridiques } from './categoriesJuridiques';
import { codesNaf } from './codesNAF';

export const tvaIntracommunautaire = (siren: number | string) => {
  const sirenNum = typeof siren === 'string' ? parseInt(siren, 10) : siren;
  const tvaKey = (12 + 3 * (sirenNum % 97)) % 97;
  const tvaNumber = `${tvaKey}${sirenNum}`;
  return `FR${tvaNumber}`;
};

export const managingDirector = (uniteLegale: any) => {
  return concatNames(uniteLegale.prenom_1, uniteLegale.nom);
};

export const libelleFromCodeNaf = (codeNaf: string) => {
  const formattedNaf = codeNaf.replace(/[.-]/g, '');
  //@ts-ignore
  return codesNaf[formattedNaf];
};
export const libelleFromCategoriesJuridiques = (categorie: string) => {
  //@ts-ignore
  return categoriesJuridiques[categorie];
};

export const getCompanyTitle = (uniteLegale: any) => {
  const isEntrepreneur = uniteLegale.categorie_juridique === '1000';
  if (isEntrepreneur) {
    return concatNames(uniteLegale.prenom_1, uniteLegale.nom);
  } else {
    return uniteLegale.denomination;
  }
};
