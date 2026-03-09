export interface IAPIBilanResponse {
  autonomie_financiere: number;
  caf_sur_ca: number;
  capacite_de_remboursement: number;
  chiffre_d_affaires: number;
  confidentiality: "Public" | string;
  couverture_des_interets: number;
  credit_clients_jours: number;
  date_cloture_exercice: string;
  ebe: number;
  ebit: number;
  ebitda: number;
  marge_brute: number;
  marge_ebe: number;
  poids_bfr_exploitation_sur_ca: number;
  poids_bfr_exploitation_sur_ca_jours: number;
  ratio_de_liquidite: number;
  ratio_de_vetuste: number;
  resultat_courant_avant_impots_sur_ca: number;
  resultat_net: number;
  rotation_des_stocks_jours: number;
  siren: string;
  taux_d_endettement: number;
  type_bilan: "C" | "K" | "S";
}
