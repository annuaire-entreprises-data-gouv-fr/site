/** COMMON TYPES */

import {
  isServicePublicFromNatureJuridique,
  isAssociationFromNatureJuridique,
} from '../utils/helpers/checks';
import { IdRna } from '../utils/helpers/id-rna';
import { Siren, Siret } from '../utils/helpers/siren-and-siret';
import {
  createEtablissementsList,
  IEtablissementsList,
} from './etablissements-list';
import { IETATADMINSTRATIF } from './etat-administratif';
import { IEtatCivil } from './immatriculation/rncs';

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
  codePostal: string;
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
    codePostal: '',
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
  estDiffusible: boolean; // diffusion des données autorisée - uniquement les EI
  estEntrepriseCommercialeDiffusible: boolean; // opposition du dirigeant - uniquement les entreprises commerciales
  etatAdministratif: IETATADMINSTRATIF;
  estActive: boolean | null;
  nomComplet: string;
  chemin: string;
  trancheEffectif: string;
  libelleTrancheEffectif: string | null;
  libelleCategorieEntreprise: string | null;
  dirigeant: IEtatCivil | null;
  complements: {
    estEntrepreneurIndividuel: boolean;
    estEss: boolean;
  };
  association: {
    idAssociation: IdRna | string | null;
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
    estDiffusible: true,
    estEntrepriseCommercialeDiffusible: true,
    etatAdministratif: IETATADMINSTRATIF.INCONNU,
    estActive: null,
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
    complements: {
      estEntrepreneurIndividuel: false,
      estEss: false,
    },
    association: {
      idAssociation: null,
    },
    colter: {
      codeColter: null,
    },
  };
};

export interface IAssociation extends Omit<IUniteLegale, 'association'> {
  association: {
    idAssociation: IdRna | string;
    exId?: string;
    nomComplet?: string;
    objet?: string;
    adresse?: string;
    adresseInconsistency?: boolean;
  };
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

export const isServicePublic = (
  toBeDetermined: IUniteLegale
): toBeDetermined is IServicePublic => {
  return (
    isServicePublicFromNatureJuridique(toBeDetermined.natureJuridique) ||
    toBeDetermined.siren.indexOf('1') === 0 ||
    toBeDetermined.siren.indexOf('2') === 0
  );
};

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
