import type { ReactElement } from "react";
import {
  ApplicationRights,
  hasRights,
} from "#models/authentication/user/rights";
import type { ISession } from "#models/authentication/user/session";
import type { IEtablissementsList } from "../etablissements-list";
import {
  type IEtablissement,
  type IUniteLegale,
  isPersonneMorale,
} from "../types";

export enum ISTATUTDIFFUSION {
  PROTECTED = "protégé en diffusion",
  PARTIAL = "partiellement diffusible",
  NON_DIFF_STRICT = "non-diffusible",
  DIFFUSIBLE = "diffusible",
}

type IUniteLegaleOrEtablissement = {
  statutDiffusion: ISTATUTDIFFUSION;
};

const canSeeNonDiffusible = (session: ISession | null) =>
  hasRights(session, ApplicationRights.nonDiffusible);

/**
 * Only diffusible. Exclude partially diffusible and non-diffusible
 * @param uniteLegaleOrEtablissement
 * @returns
 */
export const estDiffusible = (
  uniteLegaleOrEtablissement: IUniteLegaleOrEtablissement
) => uniteLegaleOrEtablissement.statutDiffusion === ISTATUTDIFFUSION.DIFFUSIBLE;
/**
 * Only strict non-diffusible. Exclude partially diffusible, protected and diffusible
 * @param uniteLegaleOrEtablissement
 * @returns
 */
export const estNonDiffusibleStrict = (
  uniteLegaleOrEtablissement: IUniteLegaleOrEtablissement
) =>
  uniteLegaleOrEtablissement.statutDiffusion ===
  ISTATUTDIFFUSION.NON_DIFF_STRICT;

/**
 * Only people that asks us to remove their data
 * @param uniteLegaleOrEtablissement
 * @returns
 */
export const estNonDiffusibleProtected = (
  uniteLegaleOrEtablissement: IUniteLegaleOrEtablissement
) => uniteLegaleOrEtablissement.statutDiffusion === ISTATUTDIFFUSION.PROTECTED;

/**
 * Anonymise name & etablissements' adresses
 * @param uniteLegale
 * @param session
 * @returns
 */
export const anonymiseUniteLegale = (
  uniteLegale: IUniteLegale,
  session: ISession | null
) => {
  if (canSeeNonDiffusible(session)) {
    return uniteLegale;
  }

  // a single etablissement can be non-diffusible with UL being diffusible
  uniteLegale.etablissements = anonymiseEtablissements(
    uniteLegale,
    uniteLegale.etablissements,
    session
  );

  if (estDiffusible(uniteLegale)) {
    return uniteLegale;
  }
  uniteLegale.nomComplet = getNomComplet(uniteLegale, session);
  uniteLegale.siege = anonymiseEtablissement(
    uniteLegale,
    uniteLegale.siege,
    session
  );
  uniteLegale.chemin = uniteLegale.siren;
  return uniteLegale;
};

/**
 * Anonymise etablissement's adressen, enseigne, denomination
 * @param uniteLegale
 * @param etablissement
 * @param session
 * @returns
 */
export const anonymiseEtablissement = (
  uniteLegale: IUniteLegale,
  etablissement: IEtablissement,
  session: ISession | null
) => {
  if (canSeeNonDiffusible(session) || estDiffusible(etablissement)) {
    return etablissement;
  }
  const { adressePostale, adresse, commune, codePostal } = etablissement || {};

  etablissement.adresse = formatAdresseForDiffusion(
    uniteLegale,
    etablissement,
    adresse,
    commune
  );
  etablissement.adressePostale = formatAdresseForDiffusion(
    uniteLegale,
    etablissement,
    adressePostale,
    commune
  );
  etablissement.codePostal = formatCodePostalForDiffusion(
    uniteLegale,
    etablissement,
    codePostal
  );
  etablissement.commune = formatCommuneForDiffusion(
    uniteLegale,
    etablissement,
    commune
  );

  etablissement.enseigne = defaultNonDiffusiblePlaceHolder(etablissement);
  etablissement.denomination = defaultNonDiffusiblePlaceHolder(etablissement);

  return etablissement;
};

const anonymiseEtablissements = (
  uniteLegale: IUniteLegale,
  etablissements: IEtablissementsList["etablissements"],
  session: ISession | null
) => {
  const anonymiser = (e: IEtablissement) =>
    anonymiseEtablissement(uniteLegale, e, session);

  etablissements.all = etablissements.all.map(anonymiser);
  etablissements.open = etablissements.open.map(anonymiser);
  etablissements.unknown = etablissements.unknown.map(anonymiser);
  etablissements.closed = etablissements.closed.map(anonymiser);

  return etablissements;
};

const nonDiffusibleDataFormatter = (e: string) => `▪︎ ▪︎ ▪︎ ${e} ▪︎ ▪︎ ▪︎`;

const defaultNonDiffusiblePlaceHolder = (
  uniteLegaleOrEtablissement: IUniteLegaleOrEtablissement
) =>
  nonDiffusibleDataFormatter(
    estNonDiffusibleProtected(uniteLegaleOrEtablissement)
      ? "information protégée"
      : "information non-diffusible"
  );

export const documentNonDiffusiblePlaceHolder = (
  uniteLegaleOrEtablissement: IUniteLegaleOrEtablissement
) =>
  nonDiffusibleDataFormatter(
    estNonDiffusibleProtected(uniteLegaleOrEtablissement)
      ? "document protégé"
      : "document non-diffusible"
  );

const getNomComplet = (uniteLegale: IUniteLegale, session: ISession | null) => {
  if (session && canSeeNonDiffusible(session)) {
    return uniteLegale.nomComplet;
  }

  if (estDiffusible(uniteLegale)) {
    return uniteLegale.nomComplet;
  }

  return defaultNonDiffusiblePlaceHolder(uniteLegale);
};

const formatAdresseForDiffusion = (
  uniteLegale: IUniteLegale,
  etablissement: IEtablissement,
  adresse: string,
  commune: string
) => {
  if (estDiffusible(etablissement)) {
    return adresse || "Adresse inconnue";
  }

  if (!commune || !isPersonneMorale(uniteLegale)) {
    return defaultNonDiffusiblePlaceHolder(etablissement);
  }
  return nonDiffusibleDataFormatter(commune);
};

const formatCodePostalForDiffusion = (
  uniteLegale: IUniteLegale,
  etablissement: IEtablissement,
  codePostal: string
) => {
  if (estDiffusible(etablissement)) {
    return codePostal;
  }

  if (!isPersonneMorale(uniteLegale)) {
    return defaultNonDiffusiblePlaceHolder(etablissement);
  }

  return nonDiffusibleDataFormatter(codePostal);
};

const formatCommuneForDiffusion = (
  uniteLegale: IUniteLegale,
  etablissement: IEtablissement,
  commune: string
) => {
  if (estDiffusible(etablissement)) {
    return commune;
  }

  if (!isPersonneMorale(uniteLegale)) {
    return defaultNonDiffusiblePlaceHolder(etablissement);
  }

  return nonDiffusibleDataFormatter(commune);
};

/**
 * Return association’s personnal informations depending on diffusibility status (https://www.insee.fr/fr/information/6683782)
 */
export const getPersonnalDataAssociation = (
  adresse: string | ReactElement,
  uniteLegale: IUniteLegale,
  session: ISession | null
) => {
  const shouldDiff = canSeeNonDiffusible(session)
    ? true
    : estDiffusible(uniteLegale);

  return shouldDiff ? adresse : defaultNonDiffusiblePlaceHolder(uniteLegale);
};
