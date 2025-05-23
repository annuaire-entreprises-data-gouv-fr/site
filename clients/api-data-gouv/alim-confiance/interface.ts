type IAlimConfianceDatagouvItem = {
  __id: string;
  APP_Libelle_etablissement: string;
  SIRET: string;
  Adresse_2_UA: string;
  Code_postal: string;
  Libelle_commune: string;
  Date_inspection: string;
  APP_Libelle_activite_etablissement: string;
  Synthese_eval_sanit: string;
  APP_Code_synthese_eval_sanit: number;
  Agrement: string;
  geores: string;
  filtre: null | string;
  ods_type_activite: string;
  reg_name: string;
  reg_code: string;
  dep_name: string;
  dep_code: string;
  com_name: string;
  com_code: string;
};

type IAlimConfianceDatagouvResponse = {
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
};

type IAlimConfianceItem = {
  syntheseEvaluation: string;
  dateInspection: string;
  libelleActiviteEtablissement: string;
  siret: string;
  denomination: string;
  adresse: string;
  codePostal: string;
  commune: string;
  code: number;
};

type IAlimConfiance = {
  data: IAlimConfianceItem[];
  meta: {
    page: number;
    page_size: number;
    total: number;
  };
};
