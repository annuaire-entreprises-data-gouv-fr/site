import {
  getAdresseEtablissement,
  getAdresseUniteLegale,
  getEtablissementName,
  getNomComplet,
} from '#models/core/statut-diffusion';
import {
  IEtablissement,
  IUniteLegale,
  isAssociation,
  isCollectiviteTerritoriale,
  isServicePublic,
} from '#models/core/types';
import { ISession } from '#utils/session';
import { formatSiret } from '../siren-and-siret';
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

export const uniteLegalePageTitle = (
  uniteLegale: IUniteLegale,
  session: ISession | null
) => {
  return `${capitalize(uniteLegaleLabel(uniteLegale))} ${getNomComplet(
    uniteLegale,
    session
  )} à ${uniteLegale.siege.codePostal} ${
    uniteLegale.siege.commune
  } - SIREN ${formatIntFr(uniteLegale.siren)} | Annuaire des Entreprises`;
};

export const uniteLegalePageDescription = (
  uniteLegale: IUniteLegale,
  session: ISession | null
) =>
  `L’administration permet aux particuliers et agents publics de vérifier les informations légales de ${getNomComplet(
    uniteLegale,
    session
  )}, ${getAdresseUniteLegale(
    uniteLegale,
    session
  )} : SIREN, SIRET, TVA Intracommunautaire, Code APE/NAF, dirigeant, adresse, justificatif  d'immatriculation...`;

export const etablissementPageDescription = (
  etablissement: IEtablissement,
  uniteLegale: IUniteLegale,
  session: ISession | null
) =>
  `L’administration permet aux particuliers et agents publics de vérifier les informations légales de l’établissement ${getEtablissementName(
    etablissement,
    uniteLegale,
    session
  )}, ${getAdresseEtablissement(
    etablissement,
    session
  )} : SIREN, SIRET, TVA Intracommunautaire, Code APE/NAF, dirigeant, adresse, justificatif  d'immatriculation...`;

export const etablissementPageTitle = (
  etablissement: IEtablissement,
  uniteLegale: IUniteLegale,
  session: ISession | null
) => {
  return `${getEtablissementName(etablissement, uniteLegale, session)} à ${
    etablissement.codePostal
  } ${etablissement.commune} - SIRET ${formatSiret(
    etablissement.siret
  )} | Annuaire des Entreprises`;
};
