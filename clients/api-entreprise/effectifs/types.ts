import { IAPIEntrepriseResponse } from "../client";

type EffectifAnnuel = {
  regime: string;
  nature: string;
  value: number | null;
  date_derniere_mise_a_jour: string | null;
};

export type IAPIEntrepriseRcpEffectifsAnnuels = IAPIEntrepriseResponse<{
  siren: string;
  annee: string;
  effectifs_annuel: EffectifAnnuel[];
}>;
