import type { ReactElement } from "react";
import type { IAgentInfo } from "#/models/authentication/agent";
import {
  ApplicationRights,
  hasRights,
} from "#/models/authentication/user/rights";
import type { ISession } from "#/models/authentication/user/session";
import type { IProtectedSiren } from "#/models/protected-siren";
import type {
  IDirigeants,
  IEtatCivil,
  IPersonneMorale,
} from "#/models/rne/types";
import type { ISearchResult } from "#/models/search";
import { normalizeName } from "#/utils/helpers/name";
import type { IEtablissementsList } from "../etablissements-list";
import {
  type IEtablissement,
  type IUniteLegale,
  isPersonneMorale,
  isPersonnePhysique,
} from "../types";

export const ISTATUTDIFFUSION = {
  PROTECTED: "protégé en diffusion",
  PARTIAL: "partiellement diffusible",
  NON_DIFF_STRICT: "non-diffusible",
  DIFFUSIBLE: "diffusible",
} as const;
export type ISTATUTDIFFUSION =
  (typeof ISTATUTDIFFUSION)[keyof typeof ISTATUTDIFFUSION];

interface IUniteLegaleOrEtablissement {
  statutDiffusion: ISTATUTDIFFUSION;
}

const canSeeNonDiffusible = (session: Partial<ISession> | null) =>
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
  session: ISession | null,
  protectedSiren: IProtectedSiren | null
): T => {
  if (canSeeNonDiffusible(session)) {
    return uniteLegale;
  }

  // a single etablissement can be non-diffusible with UL being diffusible
  uniteLegale.etablissements = anonymiseUniteLegaleEtablissements(
    uniteLegale.etablissements,
    session,
    protectedSiren
  );

  // for search results, anonymise matching etablissements
  if ("matchingEtablissements" in uniteLegale) {
    uniteLegale.matchingEtablissements = anonymiseEtablissementsList(
      uniteLegale.matchingEtablissements,
      session,
      protectedSiren
    );
  }

  uniteLegale.siege = anonymiseEtablissement(
    uniteLegale.siege,
    session,
    protectedSiren
  );

  if (estDiffusible(uniteLegale)) {
    return uniteLegale;
  }
  uniteLegale.nomComplet = getNomComplet(uniteLegale, session, protectedSiren);
  uniteLegale.chemin = getChemin(uniteLegale, session, protectedSiren);
  uniteLegale.complements = getComplements(
    uniteLegale,
    session,
    protectedSiren
  );

  if ("dirigeants" in uniteLegale) {
    uniteLegale.dirigeants = anonymiseDirigeants(
      uniteLegale.dirigeants,
      protectedSiren
    );
  }

  return uniteLegale;
};

export const anonymiseDirigeants = (
  dirigeants: IDirigeants,
  protectedSiren: IProtectedSiren | null
) => {
  if (protectedSiren && (!protectedSiren.isLegacy || dirigeants.length > 0)) {
    return dirigeants.map((dirigeant) =>
      isDirigeantProtected(dirigeant, protectedSiren)
        ? anonymiseDirigeant(dirigeant as IEtatCivil)
        : dirigeant
    );
  }

  return [];
};
const isDirigeantProtected = (
  dirigeant: IEtatCivil | IPersonneMorale,
  protectedSiren: IProtectedSiren
) => {
  if ("siren" in dirigeant) {
    return false;
  }

  return protectedSiren.dirigeants.some(
    (protectedDirigeant) =>
      protectedDirigeant.nom === normalizeName(dirigeant.nom) &&
      protectedDirigeant.prenoms === normalizeName(dirigeant.prenoms) &&
      protectedDirigeant.dateDeNaissance === dirigeant.dateNaissancePartial
  );
};
const anonymiseDirigeant = (dirigeant: IEtatCivil): IEtatCivil => ({
  dateDemission: null,
  dateNaissance: undefined,
  dateNaissancePartial: undefined,
  estDemissionnaire: false,
  lieuNaissance: undefined,
  nationalite: undefined,
  nom: nonDiffusibleDataFormatter("nom"),
  prenom: nonDiffusibleDataFormatter("prenom"),
  prenoms: "",
  role: dirigeant.role,
  sexe: null,
});
/**
 * Anonymise etablissement's adresse, enseigne, denomination
 * @param uniteLegale
 * @param etablissement
 * @param session
 * @returns
 */
export const anonymiseEtablissement = (
  etablissement: IEtablissement,
  session: ISession | null,
  protectedSiren: IProtectedSiren | null
) => {
  if (
    canSeeNonDiffusible(session) ||
    estDiffusible(etablissement) ||
    (estNonDiffusibleProtected(etablissement) && !protectedSiren?.isLegacy)
  ) {
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
  session: ISession | null,
  protectedSiren: IProtectedSiren | null
) =>
  etablissements.map((e) => anonymiseEtablissement(e, session, protectedSiren));

const anonymiseUniteLegaleEtablissements = (
  etablissements: IEtablissementsList["etablissements"],
  session: ISession | null,
  protectedSiren: IProtectedSiren | null
) => {
  etablissements.all = anonymiseEtablissementsList(
    etablissements.all,
    session,
    protectedSiren
  );
  etablissements.open = anonymiseEtablissementsList(
    etablissements.open,
    session,
    protectedSiren
  );
  etablissements.unknown = anonymiseEtablissementsList(
    etablissements.unknown,
    session,
    protectedSiren
  );
  etablissements.closed = anonymiseEtablissementsList(
    etablissements.closed,
    session,
    protectedSiren
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

const getNomComplet = (
  uniteLegale: IUniteLegale,
  session: ISession | null,
  protectedSiren: IProtectedSiren | null
) => {
  if (session && canSeeNonDiffusible(session)) {
    return uniteLegale.nomComplet;
  }

  if (
    estDiffusible(uniteLegale) ||
    isPersonneMorale(uniteLegale) ||
    (estNonDiffusibleProtected(uniteLegale) && !protectedSiren?.isLegacy)
  ) {
    return uniteLegale.nomComplet;
  }

  return defaultNonDiffusiblePlaceHolder(uniteLegale);
};
const getChemin = (
  uniteLegale: IUniteLegale,
  session: ISession | null,
  protectedSiren: IProtectedSiren | null
) => {
  if (session && canSeeNonDiffusible(session)) {
    return uniteLegale.chemin;
  }

  if (
    estDiffusible(uniteLegale) ||
    isPersonneMorale(uniteLegale) ||
    (estNonDiffusibleProtected(uniteLegale) && !protectedSiren?.isLegacy)
  ) {
    return uniteLegale.chemin;
  }

  return uniteLegale.siren;
};
const getComplements = (
  uniteLegale: IUniteLegale,
  session: ISession | null,
  protectedSiren: IProtectedSiren | null
) => {
  if (session && canSeeNonDiffusible(session)) {
    return uniteLegale.complements;
  }

  if (
    estDiffusible(uniteLegale) ||
    isPersonneMorale(uniteLegale) ||
    (estNonDiffusibleProtected(uniteLegale) && !protectedSiren?.isLegacy)
  ) {
    return uniteLegale.complements;
  }

  return {
    ...uniteLegale.complements,
    estAvocat: false,
  };
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
  user: IAgentInfo | null
) => {
  const shouldDiff = canSeeNonDiffusible({ user })
    ? true
    : estDiffusible(uniteLegale);

  return shouldDiff ? adresse : defaultNonDiffusiblePlaceHolder(uniteLegale);
};
