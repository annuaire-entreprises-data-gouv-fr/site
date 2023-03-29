/** COMMON TYPES */
import {
  createEtablissementsList,
  IEtablissementsList,
} from '#models/etablissements-list';
import { IETATADMINSTRATIF } from '#models/etat-administratif';
import { IEtatCivil } from '#models/immatriculation/rncs';
import { isAssociationFromNatureJuridique } from '#utils/helpers';
import { Siren, Siret } from '#utils/helpers';
import { IdRna } from '#utils/helpers';
import { ISTATUTDIFFUSION } from './statut-diffusion';

export interface IEtablissement {
  enseigne: string | null;
  denomination: string | null;
  siren: Siren;
  siret: Siret;
  oldSiret: Siret;
  nic: string;
  etatAdministratif: IETATADMINSTRATIF;
  statutDiffusion: ISTATUTDIFFUSION;
  estSiege: boolean;
  dateCreation: string;
  dateDerniereMiseAJour: string;
  dateFermeture: string | null;
  dateDebutActivite: string;
  adresse: string;
  adressePostale: string;
  codePostal: string;
  commune: string;
  activitePrincipale: string;
  libelleActivitePrincipale: string;
  trancheEffectif: string;
  libelleTrancheEffectif: string | null;
  latitude: string;
  longitude: string;
}

export interface IEtablissementWithUniteLegale {
  etablissement: IEtablissement;
  uniteLegale: IUniteLegale;
}

/** BASIC CONSTRUCTORS */
export const createDefaultEtablissement = (): IEtablissement => {
  return {
    //@ts-ignore
    siren: '',
    //@ts-ignore
    siret: '',
    //@ts-ignore
    oldSiret: '',
    etatAdministratif: IETATADMINSTRATIF.INCONNU,
    statutDiffusion: ISTATUTDIFFUSION.DIFFUSIBLE,
    estSiege: false,
    enseigne: null,
    denomination: null,
    nic: '',
    dateCreation: '',
    dateDerniereMiseAJour: '',
    dateDebutActivite: '',
    dateFermeture: '',
    adresse: '',
    adressePostale: '',
    codePostal: '',
    commune: '',
    activitePrincipale: '',
    libelleActivitePrincipale: '',
    trancheEffectif: '',
    libelleTrancheEffectif: '',
    latitude: '',
    longitude: '',
  };
};

export interface IUniteLegale extends IEtablissementsList {
  siren: Siren;
  oldSiren: Siren;
  siege: IEtablissement;
  allSiegesSiret: Siret[];
  natureJuridique: string;
  libelleNatureJuridique: string;
  activitePrincipale: string;
  libelleActivitePrincipale: string;
  dateCreation: string;
  dateDerniereMiseAJour: string;
  dateDebutActivite: string;
  statutDiffusion: ISTATUTDIFFUSION; // diffusion des données autorisée - uniquement les EI
  etatAdministratif: IETATADMINSTRATIF;
  nomComplet: string;
  chemin: string;
  trancheEffectif: string;
  libelleTrancheEffectif: string | null;
  libelleCategorieEntreprise: string | null;
  dirigeant: IEtatCivil | null;
  complements: IUniteLegaleComplements;
  association: {
    idAssociation: IdRna | string | null;
    data: null | IDataAssociation;
  };
  colter: {
    codeColter: string | null;
  };
}

export const createDefaultUniteLegale = (siren: Siren): IUniteLegale => {
  const siege = createDefaultEtablissement();
  siege.estSiege = true;
  return {
    siren,
    oldSiren: siren,
    siege,
    allSiegesSiret: [],
    statutDiffusion: ISTATUTDIFFUSION.DIFFUSIBLE,
    etatAdministratif: IETATADMINSTRATIF.INCONNU,
    nomComplet: '',
    chemin: siren,
    natureJuridique: '',
    libelleNatureJuridique: '',
    etablissements: createEtablissementsList([siege]),
    activitePrincipale: '',
    libelleActivitePrincipale: '',
    dateCreation: '',
    dateDerniereMiseAJour: '',
    dateDebutActivite: '',
    trancheEffectif: '',
    libelleCategorieEntreprise: null,
    libelleTrancheEffectif: null,
    dirigeant: null,
    complements: createDefaultUniteLegaleComplements(),
    association: {
      idAssociation: null,
      data: null,
    },
    colter: {
      codeColter: null,
    },
  };
};

export interface IUniteLegaleComplements {
  estBio: boolean;
  estEntrepreneurIndividuel: boolean;
  estEss: boolean;
  estEntrepreneurSpectacle: boolean;
  statutEntrepreneurSpectacle: string;
  estFiness: boolean;
  egaproRenseignee: boolean;
  estServicePublic: boolean;
  estRge: boolean;
  estUai: boolean;
}

export const createDefaultUniteLegaleComplements = () => {
  return {
    estEntrepreneurIndividuel: false,
    estEss: false,
    estBio: false,
    estEntrepreneurSpectacle: false,
    egaproRenseignee: false,
    statutEntrepreneurSpectacle: '',
    estServicePublic: false,
    estFiness: false,
    estRge: false,
    estUai: false,
  };
};

export interface IAssociation extends Omit<IUniteLegale, 'association'> {
  association: {
    idAssociation: IdRna | string;
    data: null | IDataAssociation;
  };
}

export interface IDataAssociation {
  exId: string;
  nomComplet: string;
  objet: string;
  telephone: string;
  libelleFamille: string;
  mail: string;
  siteWeb: string;
  utilPublique: boolean;
  regime: string;
  agrement: {
    type: string;
    numero: string;
    niveau: string;
    attributeur: string;
    id: number;
    dateAttribution: string;
  }[];
  formeJuridique: string;
  datePublicationJournalOfficiel: string;
  dateCreation: string;
  dateDissolution: string;
  eligibiliteCEC: boolean;
  adresseSiege: string;
  adresseGestion: string;
  adresseInconsistency: boolean;
}

export const isAssociation = (
  toBeDetermined: IUniteLegale
): toBeDetermined is IAssociation => {
  return (
    isAssociationFromNatureJuridique(toBeDetermined.natureJuridique) ||
    (toBeDetermined as IAssociation).association.idAssociation !== null
  );
};

export interface IServicePublic extends IUniteLegale {}

export const isServicePublic = (uniteLegale: IUniteLegale): boolean =>
  uniteLegale.complements.estServicePublic;

export interface ICollectiviteTerritoriale
  extends Omit<IUniteLegale, 'colter'> {
  colter: {
    codeColter: string;
    codeInsee: string;
    niveau: string;
    elus: IEtatCivil[];
  };
}

export const isCollectiviteTerritoriale = (
  toBeDetermined: IUniteLegale
): toBeDetermined is ICollectiviteTerritoriale => {
  return (
    (toBeDetermined as ICollectiviteTerritoriale).colter.codeColter !== null
  );
};

/** COMMON ERRORS */

/**
 * This is a valid siren but it was not found
 */
export class SirenNotFoundError extends Error {
  constructor(public message: string) {
    super();
  }
}

/**
 * This look like a siren but does not respect Luhn formula
 */
export class NotLuhnValidSirenError extends Error {
  constructor(public message: string) {
    super();
  }
}

/**
 * This does not even look like a siren
 */
export class NotASirenError extends Error {
  constructor(public message: string) {
    super();
  }
}

/**
 * This is a valid siret but it was not found
 */
export class SiretNotFoundError extends Error {
  constructor(public message: string) {
    super();
  }
}

/**
 * This look like a siret but does not respect Luhn formula
 */
export class NotLuhnValidSiretError extends Error {
  constructor(public message: string) {
    super();
  }
}

/**
 * This does not even look like a siret
 */
export class NotASiretError extends Error {
  constructor(public message: string) {
    super();
  }
}

/**
 * This is not a valid IdRna
 */
export class NotAValidIdRnaError extends Error {
  constructor(public message: string) {
    super();
  }
}

/** COMMON EXCEPTIONS */
export class IsLikelyASirenOrSiretException extends Error {
  constructor(public message: string) {
    super();
  }
}

// search engine exception
export class NotEnoughParamsException extends Error {
  constructor(public message: string) {
    super();
  }
}

export class SearchEngineError extends Error {
  constructor(public message: string) {
    super();
  }
}
