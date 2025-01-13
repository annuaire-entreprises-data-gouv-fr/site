import { IAPIEntrepriseResponse } from '../client';

export type IAPIEntrepriseBanqueDeFranceBilans = IAPIEntrepriseResponse<
  {
    data: DataItem;
    links: Record<string, unknown>;
    meta: Record<string, unknown>;
  }[]
>;

type ValeursCalculees = {
  disponibilites: Valeur;
  total_dettes_stables: Valeur;
  valeur_ajoutee_bdf: Valeur;
  besoin_en_fonds_de_roulement: Valeur;
  excedent_brut_exploitation: Valeur;
  capacite_autofinancement: Valeur;
  fonds_roulement_net_global: Valeur;
  ratio_fonds_roulement_net_global_sur_besoin_en_fonds_de_roulement: Valeur;
  dettes4_maturite_a_un_an_au_plus: Valeur;
};

type Valeur = {
  valeur: string;
  evolution: number | null;
};

type Donnees = {
  code_nref: string;
  valeurs: string[];
  evolution: number | null;
  code_absolu: string;
  intitule: string;
  code_EDI: string;
  code: string;
  code_type_donnee: string;
};

type DataItem = {
  annee: string;
  date_arrete_exercice: string;
  declarations: {
    numero_imprime: string;
    donnees: Donnees[];
  }[];
  valeurs_calculees: ValeursCalculees[];
};
