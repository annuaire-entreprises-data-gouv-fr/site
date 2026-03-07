interface IAlimConfianceDatagouvItem {
  __id: string;
  Adresse_2_UA: string;
  Agrement: string;
  APP_Code_synthese_eval_sanit: number;
  APP_Libelle_activite_etablissement: string;
  APP_Libelle_etablissement: string;
  Code_postal: string;
  com_code: string;
  com_name: string;
  Date_inspection: string;
  dep_code: string;
  dep_name: string;
  filtre: null | string;
  geores: string;
  Libelle_commune: string;
  ods_type_activite: string;
  reg_code: string;
  reg_name: string;
  SIRET: string;
  Synthese_eval_sanit: string;
}

interface IAlimConfianceDatagouvResponse {
  data: IAlimConfianceDatagouvItem[];
  links: {
    profile: string;
    swagger: string;
    next: string | null;
    prev: string | null;
  };
  meta: {
    page: number;
    page_size: number;
    total: number;
  };
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
