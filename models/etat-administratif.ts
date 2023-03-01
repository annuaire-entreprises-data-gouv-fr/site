export enum IETATADMINSTRATIF {
  INCONNU = 'inconnu',
  ACTIF = 'en\u00a0activité',
  ACTIF_ZERO_ETABLISSEMENT = 'en\u00a0sommeil ou présumée\u00a0inactive',
  CESSEE = 'cessée',
  FERME = 'fermé',
}

export const estActif = (uniteLegaleOrEtablissement: {
  etatAdministratif: IETATADMINSTRATIF;
}) =>
  [IETATADMINSTRATIF.ACTIF, IETATADMINSTRATIF.ACTIF_ZERO_ETABLISSEMENT].indexOf(
    uniteLegaleOrEtablissement.etatAdministratif
  ) > -1;
