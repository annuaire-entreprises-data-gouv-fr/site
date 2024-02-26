export type IFinancesSociete = {
  bilans: IBilanFinancier[];
  hasBilanConsolide: boolean;
  lastModified: string | null;
};

export interface IBilanFinancier {
  confidentiality: 'Public' | string;
  ratioDeVetuste: number;
  rotationDesStocksJours: number;
  margeEbe: number;
  resultatCourantAvantImpotsSurCa: number;
  couvertureDesInterets: number;
  poidsBfrExploitationSurCaJours: number;
  creditClientsJours: number;
  chiffreDAffaires: number;
  cafSurCa: number;
  ebitda: number;
  dateClotureExercice: string;
  ebit: number;
  ebe: number;
  margeBrute: number;
  resultatNet: number;
  siren: string;
  poidsBfrExploitationSurCa: number;
  autonomieFinanciere: number;
  capaciteDeRemboursement: number;
  ratioDeLiquidite: number;
  tauxDEndettement: number;
  type: string;
  estSimplifie: boolean;
  estConsolide: boolean;
  estComplet: boolean;
  year: number;
}
