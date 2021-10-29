import { categoriesJuridiques } from './categories-juridiques';
import { codesNaf } from './codes-NAF';
import { codesEffectifs } from './codes-effectifs';
import { codesVoies } from './codes-voie';
import { capitalize } from '../helpers/formatting';
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

const libelleFromTypeVoie = (codeVoie: string) => {
  //@ts-ignore
  return codesVoies[codeVoie] || codeVoie;
};

export const formatAdresse = (
  numero_voie: string,
  indice_repetition: string,
  type_voie: string,
  libelle_voie: string,
  code_postal: string,
  libelle_commune: string,
  pays?: string
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

  const fullLibelleFromTypeVoie = libelleFromTypeVoie(type_voie);
  return `${wrapWord(numero_voie)}${wrapWord(indice_repetition)}${wrapWord(
    fullLibelleFromTypeVoie
  )}${wrapWord(libelle_voie, false, ', ')}${code_postal || ''} ${wrapWord(
    libelle_commune,
    true,
    ''
  )}${pays ? ', ' + pays : ''}`;
};

export const formatEnseigne = (
  enseigne1: string | null,
  enseigne2: string | null,
  enseigne3: string | null
) => {
  if (!enseigne1 && !enseigne2 && !enseigne3) {
    return null;
  }
  const enseigne = `${enseigne1 || ''} ${enseigne2 || ''} ${enseigne3 || ''}`;
  return enseigne;
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
