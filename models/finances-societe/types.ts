export type IIndicateursFinanciersSociete = {
  indicateurs: IIndicateursFinanciers[];
  hasBilanConsolide: boolean | undefined;
  hasCADGFiP: boolean;
  lastModified: any;
};

export interface IIndicateursFinanciers {
  confidentiality: 'Public' | string;
  ratioDeVetuste?: number;
  rotationDesStocksJours?: number;
  margeEbe?: number;
  resultatCourantAvantImpotsSurCa?: number;
  couvertureDesInterets?: number;
  poidsBfrExploitationSurCaJours?: number;
  creditClientsJours?: number;
  chiffreDAffaires?: number;
  cafSurCa?: number;
  ebitda?: number;
  dateClotureExercice: string;
  ebit?: number;
  ebe?: number;
  margeBrute?: number;
  resultatNet?: number;
  siren?: string;
  poidsBfrExploitationSurCa?: number;
  autonomieFinanciere?: number;
  capaciteDeRemboursement?: number;
  ratioDeLiquidite?: number;
  tauxDEndettement?: number;
  type: string;
  estSimplifie?: boolean;
  estConsolide?: boolean;
  estComplet?: boolean;
  year: number;
  // zero for open data
  chiffreAffairesDGFiP?: number;
}

export const createDefaultIndicateursFinanciersWithDGFiP = (
  year: number,
  type: string,
  dateClotureExercice: string,
  CADGFiP: number
): IIndicateursFinanciers => {
  return {
    confidentiality: '',
    year,
    type,
    dateClotureExercice,
    chiffreAffairesDGFiP: CADGFiP,
  };
};
