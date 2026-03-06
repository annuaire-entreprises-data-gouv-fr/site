import type { IAPIEntrepriseResponse } from "../client";

interface EffectifAnnuel {
  date_derniere_mise_a_jour: string | null;
  nature: string;
  regime: string;
  value: number | null;
}

export type IAPIEntrepriseRcpEffectifsAnnuels = IAPIEntrepriseResponse<{
  siren: string;
  annee: string;
  effectifs_annuel: EffectifAnnuel[];
}>;
