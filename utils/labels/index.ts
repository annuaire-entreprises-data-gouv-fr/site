import { escapeTerm } from '#utils/helpers';
import { categoriesEntreprise } from './categories-entreprise';
import { categoriesJuridiques } from './categories-juridiques';
import { codesNAF1993 } from './codes-NAF-1993';
import { codesNAFRev1 } from './codes-NAF-rev-1';
import { codesNAFRev2 } from './codes-NAF-rev-2';
import { codesNAP } from './codes-NAP';
import { codesEffectifs } from './codes-effectifs';
import { codesSectionNAF } from './codes-section-NAF';
import { codesVoies } from './codes-voie';
import { departements } from './departements';

export const getUrlFromDepartement = (dep: string) => {
  // departement label without special char
  const labelDep = escapeTerm(libelleFromDepartement(dep, false));
  return `${dep}-${labelDep.replaceAll(' ', '').toLocaleLowerCase()}`;
};

export const getDepartementFromCodePostal = (codePostal: string) => {
  if (!codePostal || codePostal.length !== 5 || codePostal.startsWith('00')) {
    return null;
  }

  // dom
  if (codePostal.startsWith('97') || codePostal.startsWith('98')) {
    return codePostal.slice(0, 3);
  }
  //corse
  if (codePostal.startsWith('20')) {
    if (codePostal.startsWith('200') || codePostal.startsWith('201')) {
      return '2A';
    }
    if (codePostal.startsWith('202') || codePostal.startsWith('206')) {
      return '2B';
    }
  }

  return codePostal.slice(0, 2);
};

export const libelleFromDepartement = (
  codeDepartement: string,
  addCode = true
) => {
  //@ts-ignore
  const label = departements[codeDepartement];

  if (label) {
    const code = addCode ? ` (${codeDepartement})` : '';
    return `${label}${code}`;
  }
  return 'Département inconnu';
};

const getNomenclature = (nomenclature: string) => {
  switch (nomenclature) {
    case 'NAP':
      return codesNAP;
    case 'NAFRev1':
      return codesNAFRev1;
    case 'NAF1993':
      return codesNAF1993;
    case 'NAFRev2':
    default:
      return codesNAFRev2;
  }
};

export const libelleFromCodeNAF = (
  code = '',
  nomenclature = 'NAFRev2',
  addCode = true
) => {
  const codes = getNomenclature(nomenclature);

  //@ts-ignore
  const label = codes[code] || 'Activité inconnue';
  return addCode && code ? `${code} - ${label}` : label;
};

export const libelleFromCodeSectionNaf = (code: string) => {
  //@ts-ignore
  const label = codesSectionNAF[code];
  return label ? label : 'Section inconnue';
};

export const libelleFromCodeNAFWithoutNomenclature = (
  code = '',
  addCode = true
) => {
  for (let nomenclature of [
    codesNAFRev2,
    codesNAFRev1,
    codesNAF1993,
    codesNAP,
  ]) {
    //@ts-ignore
    const label = nomenclature[code];
    if (label) {
      return addCode && code ? `${code} - ${label}` : label;
    }
  }
  return 'Activité inconnue';
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

export const libelleFromTypeVoie = (
  codeVoie: string | null | undefined = ''
) => {
  //@ts-ignore
  return codesVoies[codeVoie] || codeVoie;
};

export const libelleFromeCodeCategorie = (
  codeCategorie: string,
  anneCategorie?: string
) => {
  let libelle = categoriesEntreprise(codeCategorie);

  if (!libelle) {
    return null;
  }

  const yearSuffix = anneCategorie ? `, en ${anneCategorie}` : '';
  return `${libelle} (${codeCategorie})${yearSuffix}`;
};
