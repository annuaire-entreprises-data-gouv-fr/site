import {
  IUniteLegale,
  isAssociation,
  isCollectiviteTerritoriale,
  isServicePublic,
} from '#models/core/types';
import { capitalize, formatIntFr } from './formatting';

const uniteLegalePronounContracted = (uniteLegale: IUniteLegale) => {
  switch (true) {
    case isAssociation(uniteLegale):
    case uniteLegale.complements.estEntrepreneurIndividuel:
      return 'de l’';
    case isCollectiviteTerritoriale(uniteLegale):
      return 'de la ';
    case isServicePublic(uniteLegale):
      return 'du ';
    default:
      return 'de la ';
  }
};

const uniteLegalePronoun = (uniteLegale: IUniteLegale) => {
  switch (true) {
    case isAssociation(uniteLegale):
    case uniteLegale.complements.estEntrepreneurIndividuel:
      return 'l’';
    case isCollectiviteTerritoriale(uniteLegale):
      return 'la ';
    case isServicePublic(uniteLegale):
      return 'le ';
    default:
      return 'la ';
  }
};

export const uniteLegaleLabelWithPronoun = (uniteLegale: IUniteLegale) => {
  return uniteLegalePronoun(uniteLegale) + uniteLegaleLabel(uniteLegale);
};

export const uniteLegaleLabelWithPronounContracted = (
  uniteLegale: IUniteLegale
) => {
  return (
    uniteLegalePronounContracted(uniteLegale) + uniteLegaleLabel(uniteLegale)
  );
};

export const uniteLegaleLabel = (uniteLegale: IUniteLegale) => {
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

export const uniteLegalePageTitle = (uniteLegale: IUniteLegale) => {
  const city =
    uniteLegale.siege.codePostal || uniteLegale.siege.commune
      ? ` à ${uniteLegale.siege.codePostal} ${uniteLegale.siege.commune}`
      : '';

  return `${capitalize(uniteLegaleLabel(uniteLegale))} ${
    uniteLegale.nomComplet
  }${city} - SIREN ${formatIntFr(
    uniteLegale.siren
  )} | L’Annuaire des Entreprises`;
};

export const uniteLegalePageDescription = (uniteLegale: IUniteLegale) =>
  `L’administration permet aux particuliers et agents publics de vérifier les informations légales de ${uniteLegale.nomComplet}, ${uniteLegale.siege.adresse} : SIREN, SIRET, TVA Intracommunautaire, Code APE/NAF, dirigeant, adresse, justificatif  d'immatriculation...`;
