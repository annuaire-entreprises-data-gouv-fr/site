import type { IAPIEntrepriseResponse } from "../client.server";

export type IAPIEntrepriseChiffreAffaires = IAPIEntrepriseResponse<
  {
    data: FinancialData;
    links: Record<string, unknown>;
    meta: Record<string, unknown>;
  }[]
>;

interface FinancialData {
  chiffre_affaires: number;
  date_fin_exercice: string;
}
