/** COMMON TYPES */
import {
  createEtablissementsList,
  IEtablissementsList,
} from '#models/etablissements-list';
import { IETATADMINSTRATIF } from '#models/etat-administratif';
import { IEtatCivil } from '#models/immatriculation';
import { IdRna, Siren, Siret } from '#utils/helpers';
import { IAPINotRespondingError } from './api-not-responding';
import { ISTATUTDIFFUSION } from './statut-diffusion';
import { ITVAIntracommunautaire } from './tva';

export interface IConventionCollective {
  idcc: string;
  idKali?: string;
  siret?: string;
  CdTN: boolean;
  title: string;
}

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
  anneeTrancheEffectif: string | null;
  latitude: string;
  longitude: string;
  conventionsCollectives: IConventionCollective[];
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
    conventionsCollectives: [],
  };
};

export interface IUniteLegale extends IEtablissementsList {
  siren: Siren;
  oldSiren: Siren;
  tva: ITVAIntracommunautaire | null;
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
  trancheEffectif: string | null;
  anneeTrancheEffectif: string | null;
  categorieEntreprise: string | null;
  anneeCategorieEntreprise: string | null;
  dirigeant: IEtatCivil | null;
  complements: IUniteLegaleComplements;
  association: {
    idAssociation: IdRna | string | null;
    data: IAPINotRespondingError | IDataAssociation | null;
  };
  colter: {
    codeColter: string | null;
  };
  conventionsCollectives: IConventionCollective[] | null;
}

export const createDefaultUniteLegale = (siren: Siren): IUniteLegale => {
  const siege = createDefaultEtablissement();
  siege.estSiege = true;
  return {
    siren,
    oldSiren: siren,
    siege,
    allSiegesSiret: [],
    tva: null,
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
    anneeCategorieEntreprise: null,
    categorieEntreprise: null,
    anneeTrancheEffectif: null,
    dirigeant: null,
    complements: createDefaultUniteLegaleComplements(),
    association: {
      idAssociation: null,
      data: null,
    },
    colter: {
      codeColter: null,
    },
    conventionsCollectives: null,
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
  estQualiopi: boolean;
  estRge: boolean;
  estOrganismeFormation: boolean;
  estSocieteMission: boolean;
  estAssociation: boolean;
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
    estOrganismeFormation: false,
    estSocieteMission: false,
    estQualiopi: false,
    estUai: false,
    estAssociation: false,
  };
};

export interface IAssociation extends Omit<IUniteLegale, 'association'> {
  association: {
    idAssociation: IdRna | string;
    data: IUniteLegale['association']['data'];
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
  bilans: IBilanFinancierAssociation[];
}

type IBilanFinancierAssociation = {
  dons: number;
  subv: number;
  produits: number;
  charges: number;
  resultat: number;
  year: number;
};

export const isAssociation = (
  toBeDetermined: IUniteLegale
): toBeDetermined is IAssociation => {
  return (
    toBeDetermined.complements.estAssociation ||
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
