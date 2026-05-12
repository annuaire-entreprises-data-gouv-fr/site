import type { IAPIEntrepriseResponse } from "../client";

export type IAPIEntrepriseBanqueDeFranceBilans = IAPIEntrepriseResponse<
  {
    data: DataItem;
    links: Record<string, unknown>;
    meta: Record<string, unknown>;
  }[]
>;

interface ValeursCalculees {
  besoin_en_fonds_de_roulement: Valeur;
  capacite_autofinancement: Valeur;
  dettes4_maturite_a_un_an_au_plus: Valeur;
  disponibilites: Valeur;
  excedent_brut_exploitation: Valeur;
  fonds_roulement_net_global: Valeur;
  ratio_fonds_roulement_net_global_sur_besoin_en_fonds_de_roulement: Valeur;
  total_dettes_stables: Valeur;
  valeur_ajoutee_bdf: Valeur;
}

interface Valeur {
  evolution: number | null;
  valeur: string;
}

interface Donnees {
  code: string;
  code_absolu: string;
  code_EDI: string;
  code_nref: string;
  code_type_donnee: string;
  evolution: number | null;
  intitule: string;
  valeurs: string[];
}

interface DataItem {
  annee: string;
  date_arrete_exercice: string;
  declarations: {
    numero_imprime: string;
    donnees: Donnees[];
  }[];
  valeurs_calculees: ValeursCalculees[];
}
