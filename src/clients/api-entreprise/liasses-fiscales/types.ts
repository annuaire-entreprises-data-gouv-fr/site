import type { IAPIEntrepriseResponse } from "../client";

interface Regime {
  code: string;
  libelle: string;
}

interface Donnee {
  code: string;
  code_absolu: string;
  code_EDI: string;
  code_nref: string;
  code_type_donnee: string;
  intitule: string;
  valeurs: string[];
}

interface Declaration {
  date_declaration: string;
  date_fin_exercice: string;
  donnees: Donnee[];
  duree_exercice: number;
  millesime: number;
  numero_imprime: string;
  regime: Regime;
}

interface ObligationFiscale {
  code: string;
  id: string;
  libelle: string | null;
  reference: string | null;
  regime: string;
}

export type IAPIEntrepriseLiassesFiscales = IAPIEntrepriseResponse<{
  obligations_fiscales: ObligationFiscale[];
  declarations: Declaration[];
}>;
