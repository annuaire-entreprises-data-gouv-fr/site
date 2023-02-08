import {
  isAssociation,
  isServicePublic,
  isCollectiviteTerritoriale,
  IUniteLegale,
} from '#models/index';

export const getCompanyPageTitle = (uniteLegale: IUniteLegale) => {
  const description = `${uniteLegale.nomComplet} à ${uniteLegale.siege.commune} - SIREN ${uniteLegale.siren} | Annuaire des Entreprises`;

  switch (true) {
    case isAssociation(uniteLegale):
      return `Association ${description}`;
    case isCollectiviteTerritoriale(uniteLegale):
    case isServicePublic(uniteLegale):
      return `Administration ${description}`;
    default:
      return `Société ${description}`;
  }
};

export const getCompanyPageDescription = (uniteLegale: IUniteLegale) =>
  `L’administration permet aux particuliers et agents publics de vérifier les informations légales officielles de ${uniteLegale.nomComplet}, ${uniteLegale.siege.adresse} : SIREN, SIRET, TVA Intracommunautaire, Code APE/NAF, dirigeant, adresse, justificatif  d'immatriculation...`;
