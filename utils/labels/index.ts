import { categoriesJuridiques } from './categories-juridiques';
import { codesNaf } from './codes-NAF';
import { codesEffectifs } from './code-effectifs';
import { capitalize, formatNumbersFr } from '../helpers/formatting';

export const libelleFromCodeNaf = (codeNaf: string, addCode = true) => {
  const formattedNaf = (codeNaf || '').replace(/[.-]/g, '');
  //@ts-ignore
  const label = codesNaf[formattedNaf] || 'Activité inconnue';
  return addCode && codeNaf ? `${codeNaf} - ${label}` : label;
};
export const libelleFromCodeEffectif = (
  codeEffectif: string,
  anneeEffectif?: string
) => {
  //@ts-ignore
  const libelle = codesEffectifs[codeEffectif];

  if (libelle && anneeEffectif) {
    return `${libelle}, en ${anneeEffectif}`;
  }
  return libelle || null;
};

export const fullLibelleFromCodeNaf = (activite_principale: string) =>
  activite_principale
    ? `${activite_principale} - ${libelleFromCodeNaf(activite_principale)}`
    : '';

export const libelleFromCategoriesJuridiques = (categorie: string) =>
  //@ts-ignore
  categorie ? categoriesJuridiques[categorie] : '';

export const fullAdress = (etablissement: any) => {
  if (
    !etablissement.libelle_commune &&
    !etablissement.geo_l4 &&
    !etablissement.code_postal
  ) {
    return 'Adresse inconnue';
  }

  const adresse = `${etablissement.geo_l4 || ''} ${
    etablissement.code_postal || ''
  } ${etablissement.libelle_commune || ''}`;

  return adresse || 'Adresse inconnue';
};

const wrapWord = (word: string, caps = false, stop = ' ') => {
  if (!word) {
    return '';
  }
  if (caps) {
    return capitalize(word.toLowerCase()) + stop;
  }
  return word.toLowerCase() + stop;
};

export const formatAdresse = (
  numero_voie: string,
  indice_repetition: string,
  type_voie: string,
  libelle_voie: string,
  code_postal: string,
  libelle_commune: string
) => {
  if (
    !numero_voie &&
    !type_voie &&
    !libelle_commune &&
    !code_postal &&
    !libelle_voie
  ) {
    return '';
  }
  return `${wrapWord(numero_voie)}${wrapWord(indice_repetition)}${wrapWord(
    type_voie
  )}${wrapWord(libelle_voie, false, ', ')}${code_postal || ''} ${wrapWord(
    libelle_commune,
    true,
    ''
  )}`;
};
