import { escapeTerm } from '#utils/helpers';
import { logWarningInSentry } from '#utils/sentry';
import { categoriesJuridiques } from './metadata/categories-juridiques';
import { codesNAF1993 } from './metadata/codes-NAF-1993';
import { codesNAFRev1 } from './metadata/codes-NAF-rev-1';
import { codesNAFRev2 } from './metadata/codes-NAF-rev-2';
import { codesNAP } from './metadata/codes-NAP';
import { codesSectionNAF } from './metadata/codes-section-NAF';
import { codesVoies } from './metadata/codes-voie';
import { conventionsCollectives } from './metadata/conventions-collectives';
import { conventionsCollectivesExclusionList } from './metadata/conventions-collectives-exclusion-list';
import { departements } from './metadata/departements';

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

export const getConventionCollectives = (idcc: string) => {
  const defaultCc = { idKali: '', title: 'Convention collective inconnue' };

  try {
    //@ts-ignore
    const cc = conventionsCollectives[idcc];
    if (cc) {
      return cc as { idKali: string; title: string };
    }

    // these CC are known to appear in API but do not exists in public list of CC
    const isSpecialIdcc =
      conventionsCollectivesExclusionList.indexOf(idcc.toString()) > -1;

    if (!isSpecialIdcc) {
      throw new Error();
    }
    return defaultCc;
  } catch {
    logWarningInSentry('Error in getConventionCollectives', {
      details: `Could not find idcc :${idcc}`,
    });
    return defaultCc;
  }
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
