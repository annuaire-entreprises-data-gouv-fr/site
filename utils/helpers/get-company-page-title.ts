import {
  isAssociation,
  isServicePublic,
  isCollectiviteTerritoriale,
  IUniteLegale,
} from '#models/index';
import { getNomComplet } from '#models/statut-diffusion';
import { capitalize } from './formatting';

export const getCompanyLabel = (uniteLegale: IUniteLegale) => {
  switch (true) {
    case isAssociation(uniteLegale):
      return `association`;
    case isCollectiviteTerritoriale(uniteLegale):
    case isServicePublic(uniteLegale):
      return `administration`;
    case uniteLegale.complements.estEntrepreneurIndividuel:
      return `entreprise individuelle`;
    default:
      return `société`;
  }
};

export const getCompanyPageTitle = (uniteLegale: IUniteLegale) => {
  return `${capitalize(getCompanyLabel(uniteLegale))} ${getNomComplet(
    uniteLegale
  )} à ${uniteLegale.siege.codePostal} - SIREN ${
    uniteLegale.siren
  } | Annuaire des Entreprises`;
};

export const getCompanyPageDescription = (uniteLegale: IUniteLegale) =>
  `L’administration permet aux particuliers et agents publics de vérifier les informations légales officielles de ${getNomComplet(
    uniteLegale
  )}, ${
    uniteLegale.siege.adresse
  } : SIREN, SIRET, TVA Intracommunautaire, Code APE/NAF, dirigeant, adresse, justificatif  d'immatriculation...`;
