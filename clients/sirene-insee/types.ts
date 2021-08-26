export interface IInseeEtablissementResponse {
  etablissement: IInseeEtablissement;
  etablissements: IInseeEtablissement[];
}
export interface IInseeEtablissementsResponse {
  header: { total: number; debut: number; nombre: number };
  etablissements: IInseeEtablissement[];
}

export interface IInseeEtablissement {
  siret: string;
  nic: string;
  etablissementSiege: string;
  statutDiffusionEtablissement: string;
  trancheEffectifsEtablissement: string;
  anneeEffectifsEtablissement: string;
  dateCreationEtablissement: string;
  dateDernierTraitementEtablissement: string;
  activitePrincipaleRegistreMetiersEtablissement: string;
  periodesEtablissement: {
    dateFin: string;
    dateDebut: string;
    etatAdministratifEtablissement: string;
    changementEtatAdministratifEtablissement: boolean;
    activitePrincipaleEtablissement: string;
  }[];
  adresseEtablissement: {
    numeroVoieEtablissement: string;
    indiceRepetitionEtablissement: string;
    typeVoieEtablissement: string;
    libelleVoieEtablissement: string;
    codePostalEtablissement: string;
    libelleCommuneEtablissement: string;
  };
  uniteLegale: IInseeetablissementUniteLegale;
}

export interface IInseeetablissementUniteLegale {
  sigleUniteLegale: string;
  dateCreationUniteLegale: string;
  periodesUniteLegale: string;
  dateDernierTraitementUniteLegale: string;
  trancheEffectifsUniteLegale: string;
  anneeEffectifsUniteLegale: string;
  statutDiffusionUniteLegale: string;
  prenom1UniteLegale: string;
  sexeUniteLegale: string;
  identifiantAssociationUniteLegale: string;
  nicSiegeUniteLegale: string;
  dateDebut: string;
  activitePrincipaleUniteLegale: string;
  categorieJuridiqueUniteLegale: string;
  denominationUniteLegale: string;
  economieSocialeSolidaireUniteLegale: string;
  etatAdministratifUniteLegale: string;
  nomUniteLegale: string;
}
