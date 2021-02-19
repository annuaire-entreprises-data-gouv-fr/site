/**
 * API SIRENE by Etalab
 *
 * This API provide :
 * - a Results route for search pages
 * - an UniteLegale for entreprise pages
 * - an Etablissement for etablissement pages
 *
 */

/** COMMON TYPES */

export interface IEtablissementResponse {
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
