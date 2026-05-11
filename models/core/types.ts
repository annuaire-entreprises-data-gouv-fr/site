/** COMMON TYPES */
import {
  createEtablissementsList,
  type IEtablissementsList,
} from "#models/core/etablissements-list";
import { IETATADMINSTRATIF } from "#models/core/etat-administratif";
import type { IEtatCivil } from "#models/rne/types";
import type { IdRna, Siren, Siret } from "#utils/helpers";
import { EAdministration } from "../administrations/EAdministration";
import {
  Exception,
  FetchRessourceException,
  type IExceptionContext,
} from "../exceptions";
import { ISTATUTDIFFUSION } from "./diffusion";

export interface IEtablissement {
  activitePrincipale: string;
  adresse: string;
  adressePostale: string;
  ancienSiege: boolean;
  anneeTrancheEffectif: string | null;
  codePostal: string;
  commune: string;
  complements: IEtablissementComplements;
  dateCreation: string;
  dateDebutActivite: string;
  dateDerniereMiseAJour: string;
  dateFermeture: string | null;
  dateMiseAJourInsee: string;
  denomination: string | null;
  enseigne: string | null;
  estSiege: boolean;
  etatAdministratif: IETATADMINSTRATIF;
  latitude: string;
  libelleActivitePrincipale: string;
  libelleActivitePrincipaleNaf25: string;
  listeIdcc: { idcc: string; title: string }[];
  longitude: string;
  nic: string;
  oldSiret: Siret;
  siren: Siren;
  siret: Siret;
  statutDiffusion: ISTATUTDIFFUSION;
  trancheEffectif: string;
}

export interface IEtablissementWithUniteLegale {
  etablissement: IEtablissement;
  uniteLegale: IUniteLegale;
}

/** BASIC CONSTRUCTORS */
export const createDefaultEtablissement = (): IEtablissement => ({
  siren: "" as Siren,
  siret: "" as Siret,
  oldSiret: "" as Siret,
  etatAdministratif: IETATADMINSTRATIF.INCONNU,
  statutDiffusion: ISTATUTDIFFUSION.DIFFUSIBLE,
  estSiege: false,
  ancienSiege: false,
  enseigne: null,
  denomination: null,
  nic: "",
  dateCreation: "",
  dateDerniereMiseAJour: "",
  dateMiseAJourInsee: "",
  dateDebutActivite: "",
  dateFermeture: "",
  adresse: "",
  adressePostale: "",
  codePostal: "",
  commune: "",
  activitePrincipale: "",
  libelleActivitePrincipale: "",
  libelleActivitePrincipaleNaf25: "",
  trancheEffectif: "",
  anneeTrancheEffectif: "",
  latitude: "",
  longitude: "",
  complements: createDefaultEtablissementComplements(),
  listeIdcc: [],
});

export interface IUniteLegale extends IEtablissementsList {
  aAccesEspaceAgent: boolean;
  activitePrincipale: string;
  // only used to pass information from unitelegale to the etablissement in insee response. Prefer etablissement.ancienSiege
  anciensSiegesSirets: Siret[];
  anneeCategorieEntreprise: string | null;
  anneeTrancheEffectif: string | null;
  association: {
    idAssociation: IdRna | string | null;
  };
  categorieEntreprise: string | null;
  chemin: string;
  colter: {
    codeColter: string | null;
  };
  complements: IUniteLegaleComplements;
  dateCreation: string;
  dateDebutActivite: string;
  dateDerniereMiseAJour: string;
  dateFermeture: string;
  // should only be filled when fallbacking on IG
  dateMiseAJourIG: string;
  // should not be empty for companies
  dateMiseAJourInpi: string;
  // should never be empty
  dateMiseAJourInsee: string;
  etatAdministratif: IETATADMINSTRATIF;
  immatriculation: IUniteLegaleImmatriculation | null;
  isNbEtablissementOuvertReliable: boolean;
  libelleActivitePrincipale: string;
  libelleActivitePrincipaleNaf25: string;
  libelleNatureJuridique: string;
  listeIdcc: { idcc: string; title: string }[];
  natureJuridique: string;
  nomComplet: string;
  oldSiren: Siren;
  siege: IEtablissement;
  siren: Siren;
  statutDiffusion: ISTATUTDIFFUSION; // diffusion des données autorisée - uniquement les EI
  trancheEffectif: string | null;
  tva: string[] | null;
}

export const createDefaultUniteLegale = (siren: Siren): IUniteLegale => {
  const siege = createDefaultEtablissement();
  siege.estSiege = true;
  return {
    aAccesEspaceAgent: false,
    siren,
    oldSiren: siren,
    siege,
    tva: [],
    anciensSiegesSirets: [],
    statutDiffusion: ISTATUTDIFFUSION.DIFFUSIBLE,
    etatAdministratif: IETATADMINSTRATIF.INCONNU,
    nomComplet: "",
    chemin: siren,
    natureJuridique: "",
    libelleNatureJuridique: "",
    etablissements: createEtablissementsList([siege]),
    activitePrincipale: "",
    libelleActivitePrincipale: "",
    libelleActivitePrincipaleNaf25: "",
    dateCreation: "",
    dateFermeture: "",
    dateDerniereMiseAJour: "",
    dateMiseAJourInsee: "",
    dateMiseAJourInpi: "",
    dateMiseAJourIG: "",
    dateDebutActivite: "",
    trancheEffectif: "",
    anneeCategorieEntreprise: null,
    categorieEntreprise: null,
    anneeTrancheEffectif: null,
    complements: createDefaultUniteLegaleComplements(),
    association: {
      idAssociation: null,
    },
    colter: {
      codeColter: null,
    },
    listeIdcc: [],
    immatriculation: null,
    isNbEtablissementOuvertReliable: true,
  };
};

export interface IUniteLegaleImmatriculation {
  capital: string;
  dateCloture: string;
  dateDebutActivite: string;
  dateFin: string;
  dateImmatriculation: string;
  dateRadiation: string;
  isPersonneMorale: boolean;
  natureEntreprise: string[];
}

export interface IUniteLegaleComplements {
  aAideADEME: boolean;
  aAideMinimis: boolean;
  bilanGesRenseigne: boolean;
  egaproRenseignee: boolean;
  estAchatsResponsables: boolean;
  estAdministration: boolean;
  estAlimConfiance: boolean;
  estAssociation: boolean;
  estAvocat: boolean;
  estBio: boolean;
  estEntrepreneurIndividuel: boolean;
  estEntrepreneurSpectacle: boolean;
  estEntrepriseInclusive: boolean;
  estEss: boolean;
  estFiness: boolean;
  estL100_3: boolean;
  estOrganismeFormation: boolean;
  estPatrimoineVivant: boolean;
  estPersonneMorale: boolean;
  estQualiopi: boolean;
  estRge: boolean;
  estSocieteMission: boolean;
  estUai: boolean;
  idFinessJuridiques: string[];
  statutEntrepreneurSpectacle: string;
  typeEntrepriseInclusive: string;
}

export const createDefaultUniteLegaleComplements =
  (): IUniteLegaleComplements => ({
    estEntrepreneurIndividuel: false,
    estPersonneMorale: false,
    estEss: false,
    estBio: false,
    estEntrepreneurSpectacle: false,
    egaproRenseignee: false,
    statutEntrepreneurSpectacle: "",
    estAdministration: false,
    estL100_3: false,
    estFiness: false,
    estRge: false,
    estOrganismeFormation: false,
    estSocieteMission: false,
    estQualiopi: false,
    estUai: false,
    estAssociation: false,
    estEntrepriseInclusive: false,
    typeEntrepriseInclusive: "",
    estAchatsResponsables: false,
    estPatrimoineVivant: false,
    estAlimConfiance: false,
    bilanGesRenseigne: false,
    idFinessJuridiques: [],
    aAideMinimis: false,
    aAideADEME: false,
    estAvocat: false,
  });

export interface IEtablissementComplements {
  // this is used to determined if etablissement belongs to an EI - useful to determinie wether we should use insee
  estEntrepreneurIndividuel: boolean;
  estPersonneMorale: boolean;
  idBio: string[];
  idFiness: string[];
  idOrganismeFormation: string[];
  idRge: string[];
  idUai: string[];
}

export const createDefaultEtablissementComplements =
  (): IEtablissementComplements => ({
    estEntrepreneurIndividuel: false,
    estPersonneMorale: false,
    idFiness: [],
    idBio: [],
    idOrganismeFormation: [],
    idRge: [],
    idUai: [],
  });

export interface IAssociation extends Omit<IUniteLegale, "association"> {
  association: {
    idAssociation: IdRna | string;
  };
}

export const isAssociation = (
  toBeDetermined: IUniteLegale
): toBeDetermined is IAssociation =>
  toBeDetermined.complements.estAssociation ||
  (toBeDetermined as IAssociation).association.idAssociation !== null;

export const isServicePublic = (uniteLegale: IUniteLegale): boolean =>
  uniteLegale.complements.estAdministration;

export const isAvocat = (uniteLegale: IUniteLegale): boolean =>
  uniteLegale.complements.estAvocat;

export const isEntrepreneurIndividuel = (
  uniteLegaleOrEtablissement: IUniteLegale | IEtablissement
): boolean => uniteLegaleOrEtablissement.complements.estEntrepreneurIndividuel;

export const isPersonnePhysique = (
  uniteLegaleOrEtablissement: IUniteLegale | IEtablissement
): boolean => !uniteLegaleOrEtablissement.complements.estPersonneMorale;

export const isPersonneMorale = (
  uniteLegaleOrEtablissement: IUniteLegale | IEtablissement
): boolean => uniteLegaleOrEtablissement.complements.estPersonneMorale;

export const hasAidesFinancieres = (uniteLegale: IUniteLegale): boolean =>
  hasAidesMinimis(uniteLegale) || hasAidesADEME(uniteLegale);

export const hasAidesMinimis = (uniteLegale: IUniteLegale): boolean =>
  uniteLegale.complements.aAideMinimis;

export const hasAidesADEME = (uniteLegale: IUniteLegale): boolean =>
  uniteLegale.complements.aAideADEME;

export interface ICollectiviteTerritoriale
  extends Omit<IUniteLegale, "colter"> {
  colter: {
    codeColter: string;
    codeInsee: string;
    niveau: string;
    elus: IEtatCivil[];
  };
}

export const isCollectiviteTerritoriale = (
  toBeDetermined: IUniteLegale
): toBeDetermined is ICollectiviteTerritoriale =>
  (toBeDetermined as ICollectiviteTerritoriale).colter.codeColter !== null;

/** COMMON ERRORS */

/**
 * This is a valid siren but it was not found
 */
export class SirenNotFoundError extends Exception {
  constructor(siren: string) {
    super({
      name: "SirenNotFoundError",
      message: "This is a valid siren but it was not found",
      context: { siren },
    });
  }
}

/**
 * This look like a siren but does not respect Luhn formula
 */
export class NotLuhnValidSirenError extends Exception {
  constructor(siren: string) {
    super({
      name: "NotLuhnValidSirenError",
      message: "This look like a siren but does not respect Luhn formula",
      context: { siren },
    });
  }
}

/**
 * This does not even look like a siren
 */
export class NotASirenError extends Exception {
  constructor(siren: string) {
    super({
      name: "NotASirenError",
      message: "This does not even look like a siren",
      context: { siren },
    });
  }
}

/**
 * This is a valid siret but it was not found
 */
export class SiretNotFoundError extends Exception {
  constructor(siret: string) {
    super({
      name: "SiretNotFoundError",
      message: "This is a valid siret but it was not found",
      context: { siret },
    });
  }
}

/**
 * This look like a siret but does not respect Luhn formula
 */
export class NotLuhnValidSiretError extends Exception {
  constructor(siret: string) {
    super({
      name: "NotLuhnValidSiretError",
      message: "This look like a siret but does not respect Luhn formula",
      context: { siret },
    });
  }
}

/**
 * This does not even look like a siret
 */
export class NotASiretError extends Exception {
  constructor(siret: string) {
    super({
      name: "NotASiretError",
      message: "This does not even look like a siret",
      context: { siret },
    });
  }
}

/**
 * This is not a valid IdRna
 */
export class NotAValidIdRnaError extends Exception {
  constructor(idRna: string) {
    super({
      name: "NotAValidIdRnaError",
      message: "This is not a valid IdRna",
      context: { idRna },
    });
  }
}

/** COMMON EXCEPTIONS */
export class IsLikelyASirenOrSiretException extends Exception {
  constructor(public sirenOrSiret: string) {
    super({
      name: "IsLikelyASirenOrSiretException",
      context: {
        details: sirenOrSiret,
      },
    });
  }
}

// search engine exception
export class NotEnoughParamsException extends Exception {
  constructor() {
    super({ name: "NotEnoughParamsException" });
  }
}

export class FetchRechercheEntrepriseException extends FetchRessourceException {
  constructor(args: {
    cause: any;
    context?: IExceptionContext;
    message?: string;
  }) {
    super({
      ...args,
      administration: EAdministration.DINUM,
      ressource: "RechercheEntreprise",
    });
  }
}
