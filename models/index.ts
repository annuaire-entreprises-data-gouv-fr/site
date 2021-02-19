import search from './search';
import getUniteLegale from './unite-legale';
import getEtablissement from './etablissement';
import getImmatriculations from './immatriculation';
import getConventionCollectives from './convention-collective';

/** COMMON TYPES */

export interface Etablissement {
  enseigne?: string;
  siren: string;
  siret: string;
  nic: string;
  isActive: boolean;
  isSiege: boolean;
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

export interface UniteLegale {
  siren: string;
  tvaNumber: string;
  siege: Etablissement;
  companyType: string;
  etablissementList: Etablissement[];
  creationDate: string;
  lastUpdateDate: string;
  firstUpdateDate: string;
  isDiffusible: string;
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
