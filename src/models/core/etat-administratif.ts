export const IETATADMINSTRATIF = {
  INCONNU: "inconnu",
  ACTIF: "en\u00a0activité",
  ACTIF_ZERO_ETABLISSEMENT:
    "en\u00a0sommeil\u00a0ou\u00a0présumée\u00a0inactive",
  CESSEE: "cessée",
  FERME: "fermé",
} as const;
export type IETATADMINSTRATIF =
  (typeof IETATADMINSTRATIF)[keyof typeof IETATADMINSTRATIF];

export const estActif = (uniteLegaleOrEtablissement: {
  etatAdministratif: IETATADMINSTRATIF;
}) =>
  (
    [
      IETATADMINSTRATIF.ACTIF,
      IETATADMINSTRATIF.ACTIF_ZERO_ETABLISSEMENT,
    ] as IETATADMINSTRATIF[]
  ).indexOf(uniteLegaleOrEtablissement.etatAdministratif) > -1;
