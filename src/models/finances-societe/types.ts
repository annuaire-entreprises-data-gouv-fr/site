export interface IIndicateursFinanciersSociete {
  hasBilanConsolide: boolean | undefined;
  hasCADGFiP: boolean;
  indicateurs: IIndicateursFinanciers[];
  lastModified: any;
}

export interface IIndicateursFinanciers {
  autonomieFinanciere?: number;
  cafSurCa?: number;
  capaciteDeRemboursement?: number;
  // zero for open data
  chiffreAffairesDGFiP?: number;
  chiffreDAffaires?: number;
  confidentiality: "Public" | string;
  couvertureDesInterets?: number;
  creditClientsJours?: number;
  dateClotureExercice: string;
  ebe?: number;
  ebit?: number;
  ebitda?: number;
  estComplet?: boolean;
  estConsolide?: boolean;
  estSimplifie?: boolean;
  margeBrute?: number;
  margeEbe?: number;
  poidsBfrExploitationSurCa?: number;
  poidsBfrExploitationSurCaJours?: number;
  ratioDeLiquidite?: number;
  ratioDeVetuste?: number;
  resultatCourantAvantImpotsSurCa?: number;
  resultatNet?: number;
  rotationDesStocksJours?: number;
  siren?: string;
  tauxDEndettement?: number;
  type: string;
  year: number;
}

export const createDefaultIndicateursFinanciersWithDGFiP = (
  year: number,
  type: string,
  dateClotureExercice: string,
  CADGFiP: number
): IIndicateursFinanciers => ({
  confidentiality: "",
  year,
  type,
  dateClotureExercice,
  chiffreAffairesDGFiP: CADGFiP,
});
