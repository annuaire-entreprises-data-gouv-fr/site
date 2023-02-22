export interface IResponseFinance {
  nhits: number;
  parameters: IParameters;
  records: IRecord[];
}

interface IParameters {
  dataset: string;
  q: string;
  rows: number;
  start: number;
  format: string;
  timezone: string;
}

export interface IRecord {
  datasetid: string;
  recordid: string;
  fields: IFields;
  record_timestamp: string;
}

interface IFields {
  ratio_de_vetuste: number;
  rotation_des_stocks_jours: number;
  marge_ebe: number;
  resultat_courant_avant_impots_sur_ca: number;
  couverture_des_interets: number;
  poids_bfr_exploitation_sur_ca_jours: number;
  credit_clients_jours: number;
  chiffre_d_affaires: number;
  caf_sur_ca: number;
  ebitda: number;
  date_cloture_exercice: string;
  ebit: number;
  marge_brute: number;
  resultat_net: number;
  siren: string;
  poids_bfr_exploitation_sur_ca: number;
  autonomie_financiere: number;
  capacite_de_remboursement: number;
  ratio_de_liquidite: number;
  taux_d_endettement: number;
}
