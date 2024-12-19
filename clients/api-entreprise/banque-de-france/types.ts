import { IAPIEntrepriseResponse } from '../client';

export type IAPIEntrepriseBanqueDeFranceBilans = IAPIEntrepriseResponse<{
  data: DataItem[];
  links: Record<string, unknown>;
  meta: Record<string, unknown>;
}>;

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

type ValeursCalculees = {
  disponibilites: {
    valeur: string;
    evolution: number;
  };
  total_dettes_stables: {
    valeur: string;
    evolution: number;
  };
  valeur_ajoutee_bdf: {
    valeur: string;
    evolution: number;
  };
  besoin_en_fonds_de_roulement: {
    valeur: string;
    evolution: number;
  };
  excedent_brut_exploitation: {
    valeur: string;
    evolution: number;
  };
  capacite_autofinancement: {
    valeur: string;
    evolution: number;
  };
  fonds_roulement_net_global: {
    valeur: string;
    evolution: number;
  };
  ratio_fonds_roulement_net_global_sur_besoin_en_fonds_de_roulement: {
    valeur: number;
    evolution: number | null;
  };
  dettes4_maturite_a_un_an_au_plus: {
    valeur: string;
    evolution: number | null;
  };
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
