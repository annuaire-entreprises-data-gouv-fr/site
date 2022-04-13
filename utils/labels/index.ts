import { categoriesJuridiques } from './categories-juridiques';
import { codesNaf } from './codes-NAF';
import { codesGreffes } from './codes-greffes';
import { codesEffectifs } from './codes-effectifs';
import { codesVoies } from './codes-voie';
import { categoriesEntreprise } from './categories-entreprise';
import { codesBeneficiaires } from './codes-beneficiaires';

export const libelleFromCodeNaf = (codeNaf = '', addCode = true) => {
  //@ts-ignore
  const label = codesNaf[codeNaf] || 'Activité inconnue';
  return addCode && codeNaf ? `${codeNaf} - ${label}` : label;
};

export const libelleFromCodeEffectif = (
  codeEffectif: string,
  anneeEffectif?: string,
  characterEmployeurUniteLegale?: string
) => {
  //@ts-ignore
  const libelle = codesEffectifs[codeEffectif];

  if (libelle && anneeEffectif) {
    return `${libelle}, en ${anneeEffectif}`;
  }
  if (libelle) {
    return libelle;
  }
  if (characterEmployeurUniteLegale === 'N') {
    return 'Unité non employeuse';
  }
  return null;
};

export const libelleFromCategoriesJuridiques = (categorie: string) =>
  //@ts-ignore
  categoriesJuridiques[categorie] || null;

export const libelleFromTypeVoie = (codeVoie: string) => {
  //@ts-ignore
  return codesVoies[codeVoie] || codeVoie;
};

export const libelleFromeCodeCategorie = (
  codeCategorie: string,
  anneCategorie?: string
) => {
  const libelle = categoriesEntreprise(codeCategorie);

  if (!!libelle && anneCategorie) {
    return `${libelle}, en ${anneCategorie}`;
  }
  if (!!libelle) {
    return libelle;
  }
  return null;
};

export const libelleFromCodeGreffe = (codeGreffe: string) => {
  //@ts-ignore
  return codesGreffes[codeGreffe] || codeGreffe;
};

export const libelleFromCodeBeneficiaires = (codeBeneficiaires: string) => {
  //@ts-ignore
  return codesBeneficiaires[codeBeneficiaires] || codeBeneficiaires;
};
