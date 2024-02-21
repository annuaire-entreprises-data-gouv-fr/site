/** COMMON TYPES */
import {
  createEtablissementsList,
  IEtablissementsList,
} from '#models/core/etablissements-list';
import { IETATADMINSTRATIF } from '#models/core/etat-administratif';
import { IEtatCivil } from '#models/immatriculation';
import { IdRna, Siren, Siret } from '#utils/helpers';
import { EAdministration } from '../administrations/EAdministration';
import { IConventionsCollectives } from '../conventions-collectives-list';
import {
  Exception,
  FetchRessourceException,
  IExceptionContext,
} from '../exceptions';
import { ITVAIntracommunautaire } from '../tva';
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
  anneeTrancheEffectif: string | null;
  latitude: string;
  longitude: string;
  complements: IEtablissementComplements;
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
    complements: createDefaultEtablissementComplements(),
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
  dateMiseAJourInsee: string;
  dateMiseAJourInpi: string;
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
  association: {
    idAssociation: IdRna | string | null;
  };
  colter: {
    codeColter: string | null;
  };
  conventionsCollectives: IConventionsCollectives;
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
    dateMiseAJourInsee: '',
    dateMiseAJourInpi: '',
    dateDebutActivite: '',
    trancheEffectif: '',
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
    conventionsCollectives: {},
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
  estEntrepriseInclusive: boolean;
  estUai: boolean;
}

export const createDefaultUniteLegaleComplements =
  (): IUniteLegaleComplements => {
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
      estEntrepriseInclusive: false,
    };
  };

export interface IEtablissementComplements {
  estEntrepreneurIndividuel: boolean;
  idFiness: string[];
  idBio: string[];
  idcc: string[];
  idOrganismeFormation: string[];
  idRge: string[];
  idUai: string[];
}

export const createDefaultEtablissementComplements =
  (): IEtablissementComplements => {
    return {
      estEntrepreneurIndividuel: false,
      idFiness: [],
      idBio: [],
      idcc: [],
      idOrganismeFormation: [],
      idRge: [],
      idUai: [],
    };
  };

export interface IAssociation extends Omit<IUniteLegale, 'association'> {
  association: {
    idAssociation: IdRna | string;
  };
}

export const isAssociation = (
  toBeDetermined: IUniteLegale
): toBeDetermined is IAssociation => {
  return (
    toBeDetermined.complements.estAssociation ||
    (toBeDetermined as IAssociation).association.idAssociation !== null
  );
};

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
export class SirenNotFoundError extends Exception {
  constructor(siren: string) {
    super({
      name: 'SirenNotFoundError',
      message: 'This is a valid siren but it was not found',
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
      name: 'NotLuhnValidSirenError',
      message: 'This look like a siren but does not respect Luhn formula',
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
      name: 'NotASirenError',
      message: 'This does not even look like a siren',
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
      name: 'SiretNotFoundError',
      message: 'This is a valid siret but it was not found',
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
      name: 'NotLuhnValidSiretError',
      message: 'This look like a siret but does not respect Luhn formula',
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
      name: 'NotASiretError',
      message: 'This does not even look like a siret',
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
      name: 'NotAValidIdRnaError',
      message: 'This is not a valid IdRna',
      context: { idRna },
    });
  }
}

/** COMMON EXCEPTIONS */
export class IsLikelyASirenOrSiretException extends Exception {
  constructor(public sirenOrSiret: string) {
    super({
      name: 'IsLikelyASirenOrSiretException',
      context: {
        details: sirenOrSiret,
      },
    });
  }
}

// search engine exception
export class NotEnoughParamsException extends Exception {
  constructor() {
    super({ name: 'NotEnoughParamsException' });
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
      ressource: 'RechercheEntreprise',
    });
  }
}
