import { categoriesJuridiques } from './categories-juridiques';
import { codesNaf } from './codes-NAF';
import { codesGreffes } from './codes-greffes';
import { codesEffectifs } from './codes-effectifs';
import { codesVoies } from './codes-voie';
import { categoriesEntreprise } from './categories-entreprise';

export const libelleFromCodeNaf = (codeNaf: string, addCode = true) => {
  const formattedNaf = (codeNaf || '').replace(/[.-]/g, '');
  //@ts-ignore
  const label = codesNaf[formattedNaf] || 'Activité inconnue';
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

export const fullLibelleFromCodeNaf = (activite_principale: string) =>
  activite_principale
    ? `${activite_principale} - ${libelleFromCodeNaf(activite_principale)}`
    : '';

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
