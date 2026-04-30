import type { IAPIEntrepriseResponse } from "../client";

export type TNatureEffectif =
  | "assujettissement_oeth"
  | "boeth"
  | "ecap"
  | "moyen";

interface EffectifAnnuel {
  date_derniere_mise_a_jour: string | null;
  nature: string;
  regime: string;
  value: number | null;
}

interface EffectifMensuel {
  annee: string;
  date_derniere_mise_a_jour: string | null;
  mois: string;
  nature:
    | "effectif_moyen_mensuel"
    | "effectif_boeth_mensuel"
    | "effectif_ecap_mensuel"
    | "effectif_assujettissement_oeth_mensuel";
  regime: "regime_general" | "regime_agricole";
  value: number | null;
}

export type IAPIEntrepriseRcpEffectifsAnnuels = IAPIEntrepriseResponse<{
  siren: string;
  annee: string;
  effectifs_annuel: EffectifAnnuel[];
}>;

export type IAPIEntrepriseRcpEffectifsMensuels = IAPIEntrepriseResponse<{
  siret: string;
  effectifs_mensuels: EffectifMensuel[];
}>;
