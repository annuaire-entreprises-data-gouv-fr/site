import {
  isAssociation,
  isServicePublic,
  isCollectiviteTerritoriale,
  IUniteLegale,
  IEtablissement,
} from '#models/index';
import {
  getAdresseEtablissement,
  getAdresseUniteLegale,
  getEtablissementName,
  getNomComplet,
} from '#models/statut-diffusion';
import { ISession } from '#utils/session';
import { formatSiret } from '../siren-and-siret';
import { capitalize, formatIntFr } from './formatting';

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

export const getCompanyPageTitle = (
  uniteLegale: IUniteLegale,
  session: ISession | null
) => {
  return `${capitalize(getCompanyLabel(uniteLegale))} ${getNomComplet(
    uniteLegale,
    session
  )} à ${uniteLegale.siege.codePostal} ${
    uniteLegale.siege.commune
  } - SIREN ${formatIntFr(uniteLegale.siren)} | Annuaire des Entreprises`;
};

export const getCompanyPageDescription = (
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

export const getEtablissementPageDescription = (
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

export const getEtablissementPageTitle = (
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
