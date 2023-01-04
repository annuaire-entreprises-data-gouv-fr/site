import {
  isAssociation,
  isServicePublic,
  isCollectiviteTerritoriale,
  IUniteLegale,
} from '#models/index';

export const getCompanyPageTitle = (uniteLegale: IUniteLegale) => {
  switch (true) {
    case isAssociation(uniteLegale):
      return `Association ${uniteLegale.nomComplet} - SIREN ${uniteLegale.siren}, ${uniteLegale.siege.siret}, ${uniteLegale.libelleActivitePrincipale} | Annuaire Entreprises`;
    case isServicePublic(uniteLegale):
      return `Service public ${uniteLegale.nomComplet} - SIREN ${uniteLegale.siren}, ${uniteLegale.siege.siret}, ${uniteLegale.libelleActivitePrincipale} | Annuaire Entreprises`;
    case isCollectiviteTerritoriale(uniteLegale):
      return `Collectivité territoriale ${uniteLegale.nomComplet} - SIREN ${uniteLegale.siren}, ${uniteLegale.siege.siret}, ${uniteLegale.libelleActivitePrincipale} | Annuaire Entreprises`;
    default:
      return `Société ${uniteLegale.nomComplet} - SIREN ${uniteLegale.siren}, ${uniteLegale.siege.siret}, ${uniteLegale.libelleActivitePrincipale} | Annuaire Entreprises`;
  }
};
