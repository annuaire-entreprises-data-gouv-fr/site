import { IAPIEntrepriseResponse } from "../client";

type Regime = {
  code: string;
  libelle: string;
};

type Donnee = {
  code_nref: string;
  valeurs: string[];
  code_absolu: string;
  intitule: string;
  code_EDI: string;
  code: string;
  code_type_donnee: string;
};

type Declaration = {
  numero_imprime: string;
  regime: Regime;
  date_declaration: string;
  date_fin_exercice: string;
  duree_exercice: number;
  millesime: number;
  donnees: Donnee[];
};

type ObligationFiscale = {
  id: string;
  code: string;
  libelle: string | null;
  reference: string | null;
  regime: string;
};

export type IAPIEntrepriseLiassesFiscales = IAPIEntrepriseResponse<{
  obligations_fiscales: ObligationFiscale[];
  declarations: Declaration[];
}>;
