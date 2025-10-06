/** COMMON TYPES */
import {
  createEtablissementsList,
  type IEtablissementsList,
} from "#models/core/etablissements-list";
import { IETATADMINSTRATIF } from "#models/core/etat-administratif";
import type { IEtatCivil } from "#models/rne/types";
import {
  type IdRna,
  isSocietePersonnePhysiqueFromNatureJuridique,
  type Siren,
  type Siret,
} from "#utils/helpers";
import { EAdministration } from "../administrations/EAdministration";
import {
  Exception,
  FetchRessourceException,
  type IExceptionContext,
} from "../exceptions";
import type { ITVAIntracommunautaire } from "../tva";
import { ISTATUTDIFFUSION } from "./diffusion";

export interface IEtablissement {
  siren: Siren;
  siret: Siret;
  oldSiret: Siret;
  etatAdministratif: IETATADMINSTRATIF;
  statutDiffusion: ISTATUTDIFFUSION;
  estSiege: boolean;
  ancienSiege: boolean;
  enseigne: string | null;
  denomination: string | null;
  nic: string;
  dateCreation: string;
  dateDerniereMiseAJour: string;
  dateMiseAJourInsee: string;
  dateDebutActivite: string;
  dateFermeture: string | null;
  adresse: string;
  adressePostale: string;
  codePostal: string;
  commune: string;
  activitePrincipale: string;
  libelleActivitePrincipale: string;
  trancheEffectif: string;
  anneeTrancheEffectif: string | null;
  latitude: string;
  longitude: string;
  complements: IEtablissementComplements;
  listeIdcc: { idcc: string; title: string }[];
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
  trancheEffectif: "",
  anneeTrancheEffectif: "",
  latitude: "",
  longitude: "",
  complements: createDefaultEtablissementComplements(),
  listeIdcc: [],
});

export interface IUniteLegale extends IEtablissementsList {
  siren: Siren;
  oldSiren: Siren;
  tva: ITVAIntracommunautaire | null;
  siege: IEtablissement;
  // only used to pass information from unitelegale to the etablissement in insee response. Prefer etablissement.ancienSiege
  anciensSiegesSirets: Siret[];
  natureJuridique: string;
  libelleNatureJuridique: string;
  activitePrincipale: string;
  libelleActivitePrincipale: string;
  dateCreation: string;
  dateDerniereMiseAJour: string;
  // should never be empty
  dateMiseAJourInsee: string;
  // should not be empty for companies
  dateMiseAJourInpi: string;
  // should only be filled when fallbacking on IG
  dateMiseAJourIG: string;
  dateDebutActivite: string;
  dateFermeture: string;
  statutDiffusion: ISTATUTDIFFUSION; // diffusion des données autorisée - uniquement les EI
  etatAdministratif: IETATADMINSTRATIF;
  nomComplet: string;
  chemin: string;
  trancheEffectif: string | null;
  anneeTrancheEffectif: string | null;
  categorieEntreprise: string | null;
  anneeCategorieEntreprise: string | null;
  complements: IUniteLegaleComplements;
  immatriculation: IUniteLegaleImmatriculation | null;
  association: {
    idAssociation: IdRna | string | null;
  };
  colter: {
    codeColter: string | null;
  };
  listeIdcc: { idcc: string; title: string }[];
  isNbEtablissementOuvertReliable: boolean;
}

export const createDefaultUniteLegale = (siren: Siren): IUniteLegale => {
  const siege = createDefaultEtablissement();
  siege.estSiege = true;
  return {
    siren,
    oldSiren: siren,
    siege,
    tva: null,
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
  dateDebutActivite: string;
  dateImmatriculation: string;
  dateRadiation: string;
  dateFin: string;
  duree: number | string;
  natureEntreprise: string[];
  dateCloture: string;
  isPersonneMorale: boolean;
  capital: string;
}

export interface IUniteLegaleComplements {
  estBio: boolean;
  estEntrepreneurIndividuel: boolean;
  estEss: boolean;
  estEntrepreneurSpectacle: boolean;
  statutEntrepreneurSpectacle: string;
  estFiness: boolean;
  egaproRenseignee: boolean;
  estServicePublic: boolean;
  estL100_3: boolean;
  estQualiopi: boolean;
  estRge: boolean;
  estOrganismeFormation: boolean;
  estSocieteMission: boolean;
  estAssociation: boolean;
  estEntrepriseInclusive: boolean;
  typeEntrepriseInclusive: string;
  estAchatsResponsables: boolean;
  estPatrimoineVivant: boolean;
  estAlimConfiance: boolean;
  bilanGesRenseigne: boolean;
  estUai: boolean;
}

export const createDefaultUniteLegaleComplements =
  (): IUniteLegaleComplements => ({
    estEntrepreneurIndividuel: false,
    estEss: false,
    estBio: false,
    estEntrepreneurSpectacle: false,
    egaproRenseignee: false,
    statutEntrepreneurSpectacle: "",
    estServicePublic: false,
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
  });

export interface IEtablissementComplements {
  // this is used to determined if etablissement belongs to an EI - useful to determinie wether we should use insee
  estEntrepreneurIndividuel: boolean;
  idFiness: string[];
  idBio: string[];
  idOrganismeFormation: string[];
  idRge: string[];
  idUai: string[];
}

export const createDefaultEtablissementComplements =
  (): IEtablissementComplements => ({
    estEntrepreneurIndividuel: false,
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
  uniteLegale.complements.estServicePublic;

export const isEntrepreneurIndividuel = (
  uniteLegaleOrEtablissement: IUniteLegale | IEtablissement
): boolean => uniteLegaleOrEtablissement.complements.estEntrepreneurIndividuel;

export const isPersonnePhysique = (uniteLegale: IUniteLegale): boolean =>
  isEntrepreneurIndividuel(uniteLegale) ||
  isSocietePersonnePhysiqueFromNatureJuridique(uniteLegale.natureJuridique);

export const isPersonneMorale = (uniteLegale: IUniteLegale): boolean =>
  !isPersonnePhysique(uniteLegale);

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
