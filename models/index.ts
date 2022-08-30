import { IdRna } from '../utils/helpers/id-rna';
import { Siren, Siret } from '../utils/helpers/siren-and-siret';
import constants from './constants';
import { IETATADMINSTRATIF } from './etat-administratif';
import { IEtatCivil } from './immatriculation/rncs';

/** COMMON TYPES */
export interface IAssociation {
  id: IdRna | string;
  exId?: string;
  nomComplet?: string;
  objet?: string;
  adresse?: string;
  adresseInconsistency?: boolean;
}

export interface IEtablissement {
  enseigne: string | null;
  denomination: string | null;
  siren: Siren;
  siret: Siret;
  oldSiret: Siret;
  nic: string;
  etatAdministratif: IETATADMINSTRATIF;
  estActif: boolean | null;
  estSiege: boolean;
  estDiffusible: boolean; // diffusion des données autorisée - uniquement les EI
  dateCreation: string;
  dateDerniereMiseAJour: string;
  dateFermeture: string | null;
  dateDebutActivite: string;
  adresse: string;
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

export interface IUniteLegale extends IEtablissementsList {
  siren: Siren;
  oldSiren: Siren;
  numeroTva: string;
  siege: IEtablissement;
  allSiegesSiret: Siret[];
  natureJuridique: string;
  libelleNatureJuridique: string;
  activitePrincipale: string;
  libelleActivitePrincipale: string;
  dateCreation: string;
  dateDerniereMiseAJour: string;
  dateDebutActivite: string;
  estDiffusible: boolean; // diffusion des données autorisée - uniquement les EI
  estEntrepriseCommercialeDiffusible: boolean; // opposition du dirigeant - uniquement les entreprises commerciales
  etatAdministratif: IETATADMINSTRATIF;
  estActive: boolean | null;
  estEntrepreneurIndividuel: boolean;
  estEss: boolean;
  nomComplet: string;
  chemin: string;
  trancheEffectif: string;
  libelleTrancheEffectif: string | null;
  libelleCategorieEntreprise: string | null;
  adresse: string;
  association: IAssociation | null;
  dirigeant: IEtatCivil | null;
}

export interface IEtablissementsList {
  etablissements: {
    all: IEtablissement[];
    open: IEtablissement[];
    closed: IEtablissement[];
    unknown: IEtablissement[];
    nombreEtablissements: number;
    nombreEtablissementsOuverts: number;
    // pagination
    currentEtablissementPage: number;
    usePagination: boolean;
  };
}

/**
 * Split a list of etablissements by status (open/closed)
 *
 * @param all
 * @param currentEtablissementPage (optional) for pagination
 * @param realTotal (optional) total etablissement (can exceed pagination)
 * @returns
 */
export const splitByStatus = (
  all: IEtablissement[],
  currentEtablissementPage = 0,
  realTotal?: number
) => {
  const open = all
    .filter((e) => e.estActif && e.estDiffusible)
    .sort((a) => (a.estSiege ? -1 : 1));

  const closed = all.filter((e) => !e.estActif && e.estDiffusible);

  const unknown = all.filter((e) => !e.estDiffusible);

  // real total can exceede all.length if we need pagination
  const nombreEtablissements = realTotal || all.length;
  const usePagination =
    nombreEtablissements > constants.resultsPerPage.etablissements;

  return {
    all,
    open,
    unknown,
    closed,
    nombreEtablissementsOuverts: open.length,
    nombreEtablissements: nombreEtablissements,
    // pagination
    usePagination,
    currentEtablissementPage,
  };
};

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
    estActif: null,
    estSiege: false,
    enseigne: null,
    denomination: null,
    nic: '',
    dateCreation: '',
    dateDerniereMiseAJour: '',
    dateDebutActivite: '',
    dateFermeture: '',
    adresse: '',
    activitePrincipale: '',
    libelleActivitePrincipale: '',
    trancheEffectif: '',
    libelleTrancheEffectif: '',
    latitude: '',
    longitude: '',
  };
};

export const createDefaultUniteLegale = (siren: Siren): IUniteLegale => {
  const siege = createDefaultEtablissement();
  siege.estSiege = true;
  return {
    siren,
    oldSiren: siren,
    siege,
    allSiegesSiret: [],
    estDiffusible: true,
    estEntrepriseCommercialeDiffusible: true,
    etatAdministratif: IETATADMINSTRATIF.INCONNU,
    estActive: null,
    estEntrepreneurIndividuel: false,
    estEss: false,
    nomComplet: '',
    chemin: siren,
    numeroTva: '',
    natureJuridique: '',
    libelleNatureJuridique: '',
    etablissements: splitByStatus([siege]),
    activitePrincipale: '',
    libelleActivitePrincipale: '',
    dateCreation: '',
    dateDerniereMiseAJour: '',
    dateDebutActivite: '',
    trancheEffectif: '',
    libelleCategorieEntreprise: null,
    libelleTrancheEffectif: null,
    adresse: '',
    association: null,
    dirigeant: null,
  };
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
