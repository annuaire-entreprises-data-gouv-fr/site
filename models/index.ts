/** COMMON TYPES */

export interface IEtablissement {
  enseigne: string | null;
  siren: string;
  siret: string;
  nic: string;
  estActif: boolean | null;
  estSiege: boolean;
  dateCreation: string;
  dateDerniereMiseAJour: string;
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
  activitePrincipale: string;
  libelleActivitePrincipale: string;
  dateCreation: string;
  dateDerniereMiseAJour: string;
  dateDebutActivite: string;
  estDiffusible: boolean;
  nomComplet: string;
  chemin: string;
  trancheEffectif: string;
  libelleTrancheEffectif: string;
  adresse: string;
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
    nomComplet: '',
    chemin: siren,
    numeroTva: '',
    natureJuridique: '',
    libelleNatureJuridique: '',
    etablissements: [siege],
    activitePrincipale: '',
    libelleActivitePrincipale: '',
    dateCreation: '',
    dateDerniereMiseAJour: '',
    dateDebutActivite: '',
    trancheEffectif: '',
    libelleTrancheEffectif: '',
    adresse: '',
  };
};

/** COMMON ERRORS */
export class SirenNotFoundError extends Error {
  constructor(public message: string) {
    super();
  }
}
export class NotASirenError extends Error {
  constructor() {
    super();
  }
}

export class SiretNotFoundError extends Error {
  constructor(public message: string) {
    super();
  }
}
export class NotASiretError extends Error {
  constructor() {
    super();
  }
}

/** COMMON EXCEPTIONS */
export class IsASirenException extends Error {
  constructor(public message: string) {
    super();
  }
}
