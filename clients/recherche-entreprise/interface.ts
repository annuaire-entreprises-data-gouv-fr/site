export type ISearchResponse = {
  results: IResult[];
  total_results: number;
  page: unknown;
  per_page: number;
  total_pages: number;
};

export type IResult = {
  siren: string;
  nom_complet: string;
  nombre_etablissements: number;
  nombre_etablissements_ouverts: number;
  siege: ISiege;
  activite_principale: string;
  date_creation: string;
  date_mise_a_jour: string;
  dirigeants: IDirigeant[];
  etat_administratif: string;
  statut_diffusion: 'O' | 'P';
  nature_juridique: string;
  nom_raison_sociale: string;
  section_activite_principale: string;
  categorie_entreprise: string;
  annee_categorie_entreprise: string;
  tranche_effectif_salarie: string;
  annee_tranche_effectif_salarie: string;
  matching_etablissements: IMatchingEtablissement[];
  etablissements?: IMatchingEtablissement[];
  complements: IComplements;
  caractere_employeur: string;
  slug: string;
};

export type ISiege = {
  activite_principale: string;
  activite_principale_registre_metier: any;
  adresse: string;
  cedex: any;
  code_pays_etranger: any;
  code_postal: string;
  commune: string;
  complement_adresse: string;
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
  libelle_voie: string;
  liste_enseignes: string[];
  liste_finess: any;
  liste_idcc: string[];
  liste_rge: any;
  liste_uai: any;
  longitude: string;
  nom_commercial: string;
  numero_voie: string;
  type_voie: string;
  siret: string;
  tranche_effectif_salarie: string;
  caractere_employeur: string;
  annee_tranche_effectif_salarie: string;
};

export type IDirigeant = {
  nom: string;
  prenoms: string;
  annee_de_naissance: string;
  qualite: string;
  type_dirigeant: string;
  siren: string;
  denomination: string;
  sigle: any;
};

export type IMatchingEtablissement = {
  activite_principale: string;
  adresse: string;
  commune: string;
  code_postal: string;
  libelle_commune: string;
  est_siege: boolean;
  etat_administratif: string;
  geo_id: string;
  latitude: string;
  liste_enseignes: string[];
  liste_finess: any;
  liste_idcc: string[];
  liste_rge: any;
  liste_uai: string[];
  longitude: string;
  nom_commercial: string;
  siret: string;
  date_creation: string;
  date_debut_activite: string;
  tranche_effectif_salarie: string;
  caractere_employeur: string;
  annee_tranche_effectif_salarie: string;
};

export type IComplements = {
  collectivite_territoriale: ICollectiviteTerritoriale;
  convention_collective_renseignee: boolean;
  est_entrepreneur_individuel: boolean;
  est_entrepreneur_spectacle: boolean;
  statut_entrepreneur_spectacle: 'invalide' | 'valide';
  est_bio: boolean;
  est_ess: boolean;
  est_organisme_formation: boolean;
  est_qualiopi: boolean;
  est_finess: boolean;
  est_service_public: boolean;
  egapro_renseignee: boolean;
  est_rge: boolean;
  est_uai: boolean;
  est_societe_mission: boolean;
  est_association: boolean;
  identifiant_association: string;
};

export type ICollectiviteTerritoriale = {
  code: string;
  code_insee: string;
  elus: IElu[];
  niveau: string;
};

export type IElu = {
  nom: string;
  prenoms: string;
  annee_de_naissance: string;
  fonction: string;
  sexe: string;
};
