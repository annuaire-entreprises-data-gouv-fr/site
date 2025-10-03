import {
  IEtablissement,
  IUniteLegale,
  isAssociation,
  isCollectiviteTerritoriale,
  isEntrepreneurIndividuel,
  isServicePublic,
} from "#models/core/types";
import { formatSiret } from "../siren-and-siret";
import { capitalize, formatIntFr } from "./formatting";

const uniteLegalePronounContracted = (uniteLegale: IUniteLegale) => {
  switch (true) {
    case isAssociation(uniteLegale):
    case isServicePublic(uniteLegale):
    case isEntrepreneurIndividuel(uniteLegale):
      return "de l’";
    case isCollectiviteTerritoriale(uniteLegale):
    default:
      return "de la ";
  }
};

const uniteLegalePronoun = (uniteLegale: IUniteLegale) => {
  switch (true) {
    case isAssociation(uniteLegale):
    case isServicePublic(uniteLegale):
    case isEntrepreneurIndividuel(uniteLegale):
      return "l’";
    default:
      return "la ";
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
    case isServicePublic(uniteLegale):
      return `administration`;
    case isEntrepreneurIndividuel(uniteLegale):
      return `entreprise individuelle`;
    default:
      return `société`;
  }
};

export const uniteLegalePageTitle = (uniteLegale: IUniteLegale) => {
  const city =
    uniteLegale.siege.codePostal || uniteLegale.siege.commune
      ? ` à ${uniteLegale.siege.codePostal} ${uniteLegale.siege.commune}`
      : "";

  return `${capitalize(uniteLegaleLabel(uniteLegale))} ${
    uniteLegale.nomComplet
  }${city} - SIREN ${formatIntFr(
    uniteLegale.siren
  )} | L’Annuaire des Entreprises`;
};

export const uniteLegalePageDescription = (uniteLegale: IUniteLegale) =>
  `L’administration permet aux particuliers et agents publics de vérifier les informations légales de ${uniteLegale.nomComplet}, ${uniteLegale.siege.adresse} : SIREN, SIRET, TVA Intracommunautaire, Code APE/NAF, dirigeant, adresse, justificatif  d'immatriculation...`;

export const etablissementPageDescription = (
  etablissement: IEtablissement,
  uniteLegale: IUniteLegale
) =>
  `L’administration permet aux particuliers et agents publics de vérifier les informations légales de l’établissement ${
    etablissement.enseigne ||
    etablissement.denomination ||
    uniteLegale.nomComplet
  }, ${
    etablissement.adresse
  } : SIREN, SIRET, TVA Intracommunautaire, Code APE/NAF, dirigeant, adresse, justificatif  d'immatriculation...`;

export const etablissementPageTitle = (
  etablissement: IEtablissement,
  uniteLegale: IUniteLegale
) => {
  const city =
    etablissement.codePostal || etablissement.commune
      ? ` à ${etablissement.codePostal} ${etablissement.commune}`
      : "";

  return `${
    etablissement.enseigne ||
    etablissement.denomination ||
    uniteLegale.nomComplet
  }${city} - SIRET ${formatSiret(
    etablissement.siret
  )} | L’Annuaire des Entreprises`;
};
