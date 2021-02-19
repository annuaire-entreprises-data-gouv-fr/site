import search from './search';
import getUniteLegale from './unite-legale';
import getEtablissement from './etablissement';
import getImmatriculations from './immatriculation';
import getConventionCollectives from './convention-collective';

/** COMMON TYPES */

export interface IEtablissement {
  enseigne?: string;
  siren: string;
  siret: string;
  nic: string;
  isActive: boolean; // === 'A'
  isSiege: boolean; // === 'true'
  creationDate: string;
  lastUpdateDate: string;
  firstUpdateDate: string;
  adress: string;
  mainActivity: string;
  mainActivityLabel: string;
  headcount: string;
  latitude: string;
  longitude: string;
}

export interface IUniteLegale {
  siren: string;
  tvaNumber: string;
  siege: IEtablissement;
  companyLegalStatus: string;
  etablissementList: IEtablissement[];
  creationDate: string;
  lastUpdateDate: string;
  firstUpdateDate: string;
  isDiffusible: boolean; // !== 'N'
  fullName: string;
  path: string;
  headcount: string;
}

export {
  getEtablissement,
  getUniteLegale,
  search,
  getImmatriculations,
  getConventionCollectives,
};
