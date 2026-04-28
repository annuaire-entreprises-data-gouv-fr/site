interface IAlimConfianceODSItem {
  adresse_1_ua: string | null;
  adresse_2_ua: string;
  adresse_3_ua: string | null;
  adresse_activite: string;
  agrement: string | null;
  app_code_synthese_eval_sanit: number;
  app_id_regroupement_etablissement: number;
  app_libelle_activite_etablissement: string[];
  app_libelle_etablissement: string;
  app_libelle_regroupement_etablissement: string;
  code_commune: string;
  code_postal: string;
  code_ua: string;
  com_code: string;
  com_name: string;
  conclusion_suite: string | null;
  contexte_inpection: string;
  date_de_cessation_bdnu: string | null;
  date_edition_ri: string;
  date_extraction: string;
  date_inspection: string;
  denree: string | null;
  dep_code: string;
  dep_name: string;
  destination: string;
  enseigne: string;
  etat_autorisation: null;
  evaluation_globale: string;
  filtre: string[];
  geo_ban: string;
  geo_mobile: string | null;
  geo_resytal: string | null;
  geores: {
    lon: number;
    lat: number;
  };
  libelle_agrement: string | null;
  libelle_commune: string;
  libelle_etablissement: string;
  lieu: string | null;
  lieu_intervention: string | null;
  lieu_intervention_adresse: string | null;
  lieu_intervention_codepostal: string | null;
  lieu_intervention_ville: string | null;
  localite: string;
  numero_inspection: string;
  ods_type_activite: string;
  procede: string | null;
  raison_sociale: string;
  reg_code: string;
  reg_name: string;
  secteur_activite: string;
  siret: string;
  synthese_eval_sanit: string;
  type_activite: string;
  type_suite: string;
}

interface IAlimConfianceODSResponse {
  lastModified: string | null;
  meta: {
    page: number;
    page_size: number;
    total: number;
  };
  records: IAlimConfianceODSItem[];
}

interface IAlimConfianceItem {
  adresse: string;
  code: number;
  codePostal: string;
  commune: string;
  dateInspection: string;
  denomination: string;
  libelleActiviteEtablissement: string;
  siret: string;
  syntheseEvaluation: string;
}

interface IAlimConfiance {
  data: IAlimConfianceItem[];
  meta: {
    page: number;
    page_size: number;
    total: number;
  };
}
