import {
  getEtablissementSireneOuverte,
  getUniteLegaleSireneOuverte,
  getResults,
} from './sirene-ouverte';

import { getUniteLegaleInsee, getEtablissementInsee } from './sirene-insee';

export interface Etablissement {
  enseigne?: string;
  siren: string;
  siret: string;
  nic: string;
  etat_administratif_etablissement: 'A' | null;
  date_creation: string;
  geo_adresse: string;
  etablissement_siege: string;
  activite_principale: string;
  date_mise_a_jour: string;
  date_debut_activite: string;
  libelle_activite_principale: string;
  is_siege: '1' | null;
  tranche_effectif_salarie: string;
  latitude: string;
  longitude: string;
}

export interface UniteLegale {
  siren: string;
  numero_tva_intra: string;
  etablissement_siege: Etablissement;
  categorie_juridique: string;
  etablissements: Etablissement[];
  date_creation: string;
  date_creation_entreprise: string;
  date_mise_a_jour: string;
  date_debut_activite: string;
  statut_diffusion: string;
  nom_complet: string;
  page_path: string;
  tranche_effectif_salarie_entreprise: string;
}

export interface ResultUniteLegale {
  siren: string;
  siret: string;
  etablissement_siege: Etablissement;
  categorie_juridique: string;
  nombre_etablissements: number;
  date_creation: string;
  libelle_activite_principale: string;
  etat_administratif_etablissement: string;
  geo_adresse: string;
  latitude: string;
  longitude: string;
  nom_complet: string;
  page_path: string;
}

export interface SearchResults {
  page: string;
  total_results: number;
  total_pages: number;
  unite_legale: ResultUniteLegale[];
}

/**
 * Download Unite Legale from Etalab SIRENE API (fallback on INSEE's API)
 * @param siren
 */
const getUniteLegale = async (siren: string) => {
  const uniteLegale = await getUniteLegaleSireneOuverte(siren);

  if (!uniteLegale) {
    return await getUniteLegaleInsee(siren);
  }
  return uniteLegale;
};

/**
 * Download Etablissement from Etalab SIRENE API (fallback on INSEE's API)
 */
const getEtablissement = async (siret: string) => {
  // const etablissement = await getEtablissementSireneOuverte(siret);
  const etablissement = null;

  if (!etablissement) {
    return await getEtablissementInsee(siret);
  }
  return etablissement;
};

export { getEtablissement, getUniteLegale, getResults };
