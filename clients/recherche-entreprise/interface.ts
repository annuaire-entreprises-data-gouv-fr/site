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
  date_fermeture: string;
  date_mise_a_jour: string;
  date_mise_a_jour_insee: string;
  date_mise_a_jour_rne: string;
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
  immatriculation: IImmatriculationResponse;
  caractere_employeur: string;
  slug: string;
};

export type IDirigeant = {
  nom: string;
  prenoms: string;
  annee_de_naissance: string;
  date_de_naissance: string;
  nationalite: string;
  qualite: string;
  type_dirigeant: string;
  siren: string;
  denomination: string;
  sigle: any;
};

export type IEtablissementCore = {
  ancien_siege: boolean;
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
  longitude: string;
  nom_commercial: string;
  siret: string;
  date_creation: string;
  date_debut_activite: string;
  date_fermeture: string;
  tranche_effectif_salarie: string;
  caractere_employeur: string;
  annee_tranche_effectif_salarie: string;
  liste_finess: string[] | null;
  liste_id_bio: string[] | null;
  liste_idcc: string[] | null;
  liste_id_organisme_formation: string[] | null;
  liste_rge: string[] | null;
  liste_uai: string[] | null;
  statut_diffusion_etablissement: string;
};

export interface ISiege extends IEtablissementCore {
  activite_principale_registre_metier: any;
  cedex: any;
  code_pays_etranger: any;
  commune: string;
  complement_adresse: string;
  coordonnees: string;
  departement: string;
  distribution_speciale: any;
  est_siege: boolean;
  indice_repetition: any;
  libelle_cedex: any;
  libelle_commune: string;
  libelle_commune_etranger: any;
  libelle_pays_etranger: any;
  libelle_voie: string;
  numero_voie: string;
  type_voie: string;
}

export type IMatchingEtablissement = IEtablissementCore;

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
  est_l100_3: boolean;
  egapro_renseignee: boolean;
  est_rge: boolean;
  est_uai: boolean;
  est_societe_mission: boolean;
  est_association: boolean;
  identifiant_association: string;
  est_siae: boolean;
  type_siae: string;
  est_achats_responsables: boolean;
  est_patrimoine_vivant: boolean;
  est_alim_confiance: boolean;
  bilan_ges_renseigne: boolean;
  liste_idcc: string[];
};

export type IImmatriculationResponse = {
  date_debut_activite: string | null;
  date_immatriculation: string | null;
  date_radiation: string | null;
  duree_personne_morale: number | null;
  nature_entreprise: string[];
  date_cloture_exercice: string | null;
  capital_social: number | null;
  capital_variable: boolean;
  devise_capital: string | null;
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
