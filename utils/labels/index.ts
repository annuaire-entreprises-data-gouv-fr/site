import { categoriesJuridiques } from './categories-juridiques';
import { codesSectionNAF } from './codes-section-NAF';
import { codesNAP } from './codes-NAP';
import { codesNAFRev2 } from './codes-NAF-rev-2';
import { codesNAF1993 } from './codes-NAF-1993';
import { codesNAFRev1 } from './codes-NAF-rev-1';
import { codesEffectifs } from './codes-effectifs';
import { codesVoies } from './codes-voie';
import { categoriesEntreprise } from './categories-entreprise';

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
