export interface SearchResponse {
  results: Result[];
  total_results: number;
  page: number;
  per_page: number;
  total_pages: number;
}

export interface Result {
  siren: string;
  nom_complet: string;
  nombre_etablissements: number;
  nombre_etablissements_ouverts: number;
  siege: Siege;
  activite_principale: string;
  categorie_entreprise?: string;
  date_creation: string;
  date_mise_a_jour: string;
  dirigeants: Dirigeant[];
  etat_administratif: string;
  nature_juridique: string;
  nom_raison_sociale?: string;
  section_activite_principale: string;
  tranche_effectif_salarie?: string;
  matching_etablissements: MatchingEtablissement[];
  complements: Complements;
}

export interface Siege {
  activite_principale: string;
  activite_principale_registre_metier: any;
  adresse: string;
  cedex: any;
  code_pays_etranger: any;
  code_postal: string;
  commune: string;
  complement_adresse?: string;
  coordonnees: string;
  date_creation: string;
  date_debut_activite: string;
  departement: string;
  distribution_speciale: any;
  est_siege: boolean;
  etat_administratif: string;
  geo_adresse: string;
  geo_id: string;
  indice_repetition: any;
  latitude: string;
  libelle_cedex: any;
  libelle_commune: string;
  libelle_commune_etranger: any;
  libelle_pays_etranger: any;
  libelle_voie?: string;
  liste_enseignes?: string[];
  liste_finess: any;
  liste_idcc?: string[];
  liste_rge: any;
  liste_uai: any;
  longitude: string;
  nom_commercial?: string;
  numero_voie?: string;
  siret: string;
  tranche_effectif_salarie?: string;
  type_voie?: string;
}

export interface Dirigeant {
  nom?: string;
  prenoms?: string;
  annee_de_naissance?: string;
  qualite?: string;
  type_dirigeant: string;
  siren?: string;
  denomination?: string;
  sigle: any;
}

export interface MatchingEtablissement {
  activite_principale: string;
  adresse: string;
  commune: string;
  est_siege: boolean;
  etat_administratif: string;
  geo_id: string;
  latitude: string;
  liste_enseignes?: string[];
  liste_finess: any;
  liste_idcc?: string[];
  liste_rge: any;
  liste_uai?: string[];
  longitude: string;
  nom_commercial?: string;
  siret: string;
}

export interface Complements {
  collectivite_territoriale?: CollectiviteTerritoriale;
  convention_collective_renseignee: boolean;
  est_entrepreneur_individuel: boolean;
  est_entrepreneur_spectacle: boolean;
  est_ess: boolean;
  est_finess: boolean;
  est_rge: boolean;
  est_uai: boolean;
  identifiant_association?: string;
}

export interface CollectiviteTerritoriale {
  code: string;
  code_insee: string;
  elus: Elu[];
  niveau: string;
}

export interface Elu {
  nom: string;
  prenoms: string;
  annee_de_naissance: string;
  fonction?: string;
  sexe: string;
}
