/** COMMON TYPES */
export interface IAssociation {
  id: string;
  exId?: string;
  nomComplet?: string;
  objet?: string;
  adresse?: string;
}

export interface IEtablissement {
  enseigne: string | null;
  siren: string;
  siret: string;
  nic: string;
  estActif: boolean | null;
  estSiege: boolean;
  dateCreation: string;
  dateDerniereMiseAJour: string;
  dateFermeture: string | null;
  dateDebutActivite: string;
  adresse: string;
  activitePrincipale: string;
  libelleActivitePrincipale: string;
  trancheEffectif: string;
  libelleTrancheEffectif: string;
  latitude: string;
  longitude: string;
}

export interface IUniteLegale {
  siren: string;
  numeroTva: string;
  siege: IEtablissement;
  natureJuridique: string;
  libelleNatureJuridique: string;
  etablissements: IEtablissement[];
  nombreEtablissements: number;
  activitePrincipale: string;
  libelleActivitePrincipale: string;
  dateCreation: string;
  dateDerniereMiseAJour: string;
  dateDebutActivite: string;
  estDiffusible: boolean;
  estActive: boolean | null;
  estEntrepreneurIndividuel: boolean;
  estEss: boolean;
  nomComplet: string;
  chemin: string;
  trancheEffectif: string;
  libelleTrancheEffectif: string;
  adresse: string;
  // etablissement list pagination
  currentEtablissementPage?: number;
  association: IAssociation | null;
}

/** BASIC CONSTRUCTORS */
export const createDefaultEtablissement = (): IEtablissement => {
  return {
    siren: '',
    estActif: null,
    estSiege: false,
    enseigne: null,
    siret: '',
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

export const createDefaultUniteLegale = (siren: string): IUniteLegale => {
  const siege = createDefaultEtablissement();
  siege.estSiege = true;
  return {
    siren,
    siege,
    estDiffusible: true,
    estActive: null,
    estEntrepreneurIndividuel: false,
    estEss: false,
    nomComplet: '',
    chemin: siren,
    numeroTva: '',
    natureJuridique: '',
    libelleNatureJuridique: '',
    etablissements: [siege],
    nombreEtablissements: 1,
    activitePrincipale: '',
    libelleActivitePrincipale: '',
    dateCreation: '',
    dateDerniereMiseAJour: '',
    dateDebutActivite: '',
    trancheEffectif: '',
    libelleTrancheEffectif: '',
    adresse: '',
    association: null,
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

/** COMMON EXCEPTIONS */
export class IsLikelyASirenOrSiretException extends Error {
  constructor(public message: string) {
    super();
  }
}
