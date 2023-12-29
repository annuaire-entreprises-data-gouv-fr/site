import { escapeString } from './formatting';
import { categoriesJuridiques } from './metadata/categories-juridiques';
import { codesNAF1993 } from './metadata/codes-NAF-1993';
import { codesNAFRev1 } from './metadata/codes-NAF-rev-1';
import { codesNAFRev2 } from './metadata/codes-NAF-rev-2';
import { codesNAP } from './metadata/codes-NAP';
import { codesSectionNAF } from './metadata/codes-section-NAF';
import { codesVoies } from './metadata/codes-voie';
import { departements } from './metadata/departements';

export const getUrlFromDepartement = (dep: string) => {
  // departement label without special char
  const labelDep = escapeString(libelleFromDepartement(dep, false));
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

  const label =
    //@ts-ignore
    codes[code] || libelleFromCodeNAFWithoutNomenclature(code);

  return addCode && code ? `${label} (${code})` : label;
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
      return addCode && code ? `${label} (${code})` : label;
    }
  }
  return 'Activité inconnue';
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
