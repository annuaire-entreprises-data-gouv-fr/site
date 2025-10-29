import type { ReactElement } from "react";
import {
  ApplicationRights,
  hasRights,
} from "#models/authentication/user/rights";
import type { ISession } from "#models/authentication/user/session";
import type { ISearchResult } from "#models/search";
import type { IEtablissementsList } from "../etablissements-list";
import {
  type IEtablissement,
  type IUniteLegale,
  isPersonneMorale,
  isPersonnePhysique,
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
export const anonymiseUniteLegale = <T extends IUniteLegale | ISearchResult>(
  uniteLegale: T,
  session: ISession | null
): T => {
  if (canSeeNonDiffusible(session)) {
    return uniteLegale;
  }

  // a single etablissement can be non-diffusible with UL being diffusible
  uniteLegale.etablissements = anonymiseUniteLegaleEtablissements(
    uniteLegale.etablissements,
    session
  );

  // for search results, anonymise matching etablissements
  if ("matchingEtablissements" in uniteLegale) {
    uniteLegale.matchingEtablissements = anonymiseEtablissementsList(
      uniteLegale.matchingEtablissements,
      session
    );
  }

  if (estDiffusible(uniteLegale)) {
    return uniteLegale;
  }
  uniteLegale.nomComplet = getNomComplet(uniteLegale, session);
  uniteLegale.siege = anonymiseEtablissement(uniteLegale.siege, session);
  uniteLegale.chemin = uniteLegale.siren;
  return uniteLegale;
};

/**
 * Anonymise etablissement's adresse, enseigne, denomination
 * @param uniteLegale
 * @param etablissement
 * @param session
 * @returns
 */
export const anonymiseEtablissement = (
  etablissement: IEtablissement,
  session: ISession | null
) => {
  if (canSeeNonDiffusible(session) || estDiffusible(etablissement)) {
    return etablissement;
  }
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

  if (isPersonnePhysique(etablissement)) {
    etablissement.codePostal = defaultNonDiffusiblePlaceHolder(etablissement);
    etablissement.commune = defaultNonDiffusiblePlaceHolder(etablissement);

    etablissement.enseigne = defaultNonDiffusiblePlaceHolder(etablissement);
    etablissement.denomination = defaultNonDiffusiblePlaceHolder(etablissement);
  }

  return etablissement;
};

const anonymiseEtablissementsList = (
  etablissements: IEtablissement[],
  session: ISession | null
) => etablissements.map((e) => anonymiseEtablissement(e, session));

const anonymiseUniteLegaleEtablissements = (
  etablissements: IEtablissementsList["etablissements"],
  session: ISession | null
) => {
  etablissements.all = anonymiseEtablissementsList(etablissements.all, session);
  etablissements.open = anonymiseEtablissementsList(
    etablissements.open,
    session
  );
  etablissements.unknown = anonymiseEtablissementsList(
    etablissements.unknown,
    session
  );
  etablissements.closed = anonymiseEtablissementsList(
    etablissements.closed,
    session
  );

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

  if (estDiffusible(uniteLegale) || isPersonneMorale(uniteLegale)) {
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

  if (!commune || isPersonnePhysique(etablissement)) {
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
