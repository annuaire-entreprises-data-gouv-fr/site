import { IAPIEntrepriseResponse } from '../client';

export type IAPIEntrepriseDgfipChiffreAffaires = IAPIEntrepriseResponse<
  {
    data: FinancialData;
    links: Record<string, unknown>;
    meta: Record<string, unknown>;
  }[]
>;

type FinancialData = {
  chiffre_affaires: number;
  date_fin_exercice: string;
};