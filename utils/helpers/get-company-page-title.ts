import {
  isAssociation,
  isServicePublic,
  isCollectiviteTerritoriale,
  IUniteLegale,
} from '#models/index';

export const getCompanyPageTitle = (uniteLegale: IUniteLegale) => {
  const description = `- SIREN ${uniteLegale.siren}, ${uniteLegale.siege.siret}, ${uniteLegale.libelleActivitePrincipale} | Annuaire Entreprises`;

  switch (true) {
    case isAssociation(uniteLegale):
      return `Association ${description}`;
    case isServicePublic(uniteLegale):
      return `Service public ${description}`;
    case isCollectiviteTerritoriale(uniteLegale):
      return `Collectivité territoriale ${description}`;
    default:
      return `Société ${description}`;
  }
};
