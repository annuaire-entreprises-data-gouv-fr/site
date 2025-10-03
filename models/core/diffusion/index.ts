import type { ReactElement } from "react";
import {
  ApplicationRights,
  hasRights,
} from "#models/authentication/user/rights";
import type { ISession } from "#models/authentication/user/session";
import type { IEtablissementsList } from "../etablissements-list";
import type { IEtablissement, IUniteLegale } from "../types";

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
    uniteLegale.etablissements,
    session
  );

  if (estDiffusible(uniteLegale)) {
    return uniteLegale;
  } else {
    uniteLegale.nomComplet = getNomComplet(uniteLegale, session);
    uniteLegale.siege = anonymiseEtablissement(uniteLegale.siege, session);
    uniteLegale.chemin = uniteLegale.siren;
    return uniteLegale;
  }
};

/**
 * Anonymise etablissement's adressen, enseigne, denomination
 * @param uniteLegale
 * @param session
 * @returns
 */
export const anonymiseEtablissement = (
  etablissement: IEtablissement,
  session: ISession | null
) => {
  if (canSeeNonDiffusible(session) || estDiffusible(etablissement)) {
    return etablissement;
  } else {
    const { adressePostale, adresse, commune } = etablissement || {};

    etablissement.adresse = formatAdresseForDiffusion(
      etablissement,
      adresse,
      commune
    );
    etablissement.adressePostale = formatAdresseForDiffusion(
      etablissement,
      adressePostale,
      commune
    );

    // 851915207
    // should be reverted with https://github.com/annuaire-entreprises-data-gouv-fr/site/pull/1955
    if (etablissement.siren === "851915207") {
      etablissement.adresse = "";
      etablissement.adressePostale = "";
      etablissement.commune = "";
      etablissement.codePostal = "";
    }

    etablissement.enseigne = defaultNonDiffusiblePlaceHolder(etablissement);
    etablissement.denomination = defaultNonDiffusiblePlaceHolder(etablissement);
    return etablissement;
  }
};

const anonymiseEtablissements = (
  etablissements: IEtablissementsList["etablissements"],
  session: ISession | null
) => {
  const anonymiser = (e: IEtablissement) => anonymiseEtablissement(e, session);

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
  etablissement: IEtablissement,
  adresse: string,
  commune: string
) => {
  if (estDiffusible(etablissement)) {
    return adresse || "Adresse inconnue";
  }

  if (!commune) {
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
