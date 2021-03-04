import { categoriesJuridiques } from './categories-juridiques';
import { codesNaf } from './codes-NAF';
import { codesEffectifs } from './code-effectifs';

export const libelleFromCodeNaf = (codeNaf: string, addCode = true) => {
  const formattedNaf = (codeNaf || '').replace(/[.-]/g, '');
  //@ts-ignore
  const label = codesNaf[formattedNaf] || 'Activité inconnue';
  return addCode ? `${codeNaf} - ${label}` : label;
};
export const libelleFromCodeEffectif = (codeEffectif: string) => {
  //@ts-ignore
  return codesEffectifs[codeEffectif] || null;
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

export const formatAdresse = (
  numero_voie: string,
  type_voie: string,
  libelle_commune: string,
  code_postal: string,
  libelle_voie: string
) => {
  return `${numero_voie} ${type_voie} ${libelle_voie} ${code_postal} ${libelle_commune}`;
};
