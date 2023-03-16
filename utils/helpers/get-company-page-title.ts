import {
  isAssociation,
  isServicePublic,
  isCollectiviteTerritoriale,
  IUniteLegale,
} from '#models/index';
import { capitalize } from './formatting';

export const getCompanyPronoun = (uniteLegale: IUniteLegale) => {
  switch (true) {
    case isAssociation(uniteLegale):
    case uniteLegale.complements.estEntrepreneurIndividuel:
      return 'L’';
    case isCollectiviteTerritoriale(uniteLegale):
      return 'La ';
    case isServicePublic(uniteLegale):
      return 'Le ';
    default:
      return 'La ';
  }
};

export const getCompanyLabel = (uniteLegale: IUniteLegale) => {
  switch (true) {
    case isAssociation(uniteLegale):
      return `association`;
    case isCollectiviteTerritoriale(uniteLegale):
      return 'collectivité territoriale';
    case isServicePublic(uniteLegale):
      return `service public`;
    case uniteLegale.complements.estEntrepreneurIndividuel:
      return `entreprise individuelle`;
    default:
      return `société`;
  }
};

export const getCompanyPageTitle = (uniteLegale: IUniteLegale) => {
  return `${capitalize(getCompanyLabel(uniteLegale))} ${
    uniteLegale.nomComplet
  } à ${uniteLegale.siege.codePostal} - SIREN ${
    uniteLegale.siren
  } | Annuaire des Entreprises`;
};

export const getCompanyPageDescription = (uniteLegale: IUniteLegale) =>
  `L’administration permet aux particuliers et agents publics de vérifier les informations légales officielles de ${uniteLegale.nomComplet}, ${uniteLegale.siege.adresse} : SIREN, SIRET, TVA Intracommunautaire, Code APE/NAF, dirigeant, adresse, justificatif  d'immatriculation...`;
