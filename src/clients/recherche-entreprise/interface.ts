export interface ISearchResponse {
  execution_time?: number;
  page: unknown;
  per_page: number;
  results: IResult[];
  total_pages: number;
  total_results: number;
}

export interface IResult {
  activite_principale: string;
  activite_principale_naf25: string;
  admin: {
    slug: string;
    a_acces_espace_agent: boolean;
  };
  annee_categorie_entreprise: string;
  annee_tranche_effectif_salarie: string;
  bodacc: {
    radiation: {
      est_radie: true;
      id_annonce: string;
      date: string | null;
    } | null;
    procedure_collective: {
      statut:
        | "sauvegarde"
        | "liquidation_judiciaire"
        | "redressement_judiciaire"
        | null;
      id_annonce: string;
      date: string | null;
    } | null;
  };
  caractere_employeur: string;
  categorie_entreprise: string;
  complements: IComplements;
  date_creation: string;
  date_fermeture: string;
  date_mise_a_jour: string;
  date_mise_a_jour_insee: string;
  date_mise_a_jour_rne: string;
  dirigeants: IDirigeant[];
  etablissements?: IMatchingEtablissement[];
  etat_administratif: string;
  immatriculation: IImmatriculationResponse;
  matching_etablissements: IMatchingEtablissement[];
  meta: unknown;
  nature_juridique: string;
  nom_complet: string;
  nom_raison_sociale: string;
  nombre_etablissements: number;
  nombre_etablissements_ouverts: number;
  section_activite_principale: string;
  siege: ISiege;
  siren: string;
  statut_diffusion: "O" | "P";
  tranche_effectif_salarie: string;
  tva: string[] | null;
}

export interface IDirigeant {
  annee_de_naissance: string;
  date_de_naissance: string;
  denomination: string;
  nationalite: string;
  nom: string;
  prenoms: string;
  qualite: string;
  sigle: any;
  siren: string;
  type_dirigeant: string;
}

export interface IEtablissementCore {
  activite_principale: string;
  activite_principale_naf25: string;
  adresse: string;
  ancien_siege: boolean;
  annee_tranche_effectif_salarie: string;
  caractere_employeur: string;
  code_postal: string;
  commune: string;
  date_creation: string;
  date_debut_activite: string;
  date_fermeture: string;
  est_siege: boolean;
  etat_administratif: string;
  geo_id: string;
  latitude: string;
  libelle_commune: string;
  liste_enseignes: string[];
  liste_finess: string[] | null;
  liste_id_bio: string[] | null;
  liste_id_organisme_formation: string[] | null;
  liste_idcc: string[] | null;
  liste_rge: string[] | null;
  liste_uai: string[] | null;
  longitude: string;
  nom_commercial: string;
  siret: string;
  statut_diffusion_etablissement: string;
  tranche_effectif_salarie: string;
}

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

export interface IComplements {
  a_aide_ademe: boolean;
  a_aide_minimis: boolean;
  bilan_ges_renseigne: boolean;
  collectivite_territoriale: ICollectiviteTerritoriale;
  convention_collective_renseignee: boolean;
  egapro_renseignee: boolean;
  est_achats_responsables: boolean;
  est_administration: boolean;
  est_alim_confiance: boolean;
  est_association: boolean;
  est_avocat: boolean;
  est_bio: boolean;
  est_entrepreneur_individuel: boolean;
  est_entrepreneur_spectacle: boolean;
  est_ess: boolean;
  est_finess: boolean;
  est_organisme_formation: boolean;
  est_patrimoine_vivant: boolean;
  est_qualiopi: boolean;
  est_rge: boolean;
  est_siae: boolean;
  est_societe_mission: boolean;
  est_uai: boolean;
  identifiant_association: string;
  liste_finess_juridique: string[];
  liste_idcc: string[];
  statut_entrepreneur_spectacle: "invalide" | "valide";
  type_siae: string;
}

export interface IImmatriculationResponse {
  capital_social: number | null;
  capital_variable: boolean;
  date_cloture_exercice: string | null;
  date_debut_activite: string | null;
  date_fin_existence: string | null;
  date_immatriculation: string | null;
  date_radiation: string | null;
  devise_capital: string | null;
  nature_entreprise: string[];
}

export interface ICollectiviteTerritoriale {
  code: string;
  code_insee: string;
  elus: IElu[];
  niveau: string;
}

export interface IElu {
  annee_de_naissance: string;
  fonction: string;
  nom: string;
  prenoms: string;
  sexe: string;
}
