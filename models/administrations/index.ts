export enum EAdministration {
  EDUCATION_NATIONALE = 'education-nationale',
  ADEME = 'ademe',
  CMAFRANCE = 'cma',
  DILA = 'dila',
  DINUM = 'dinum',
  MC = 'mc',
  MEF = 'mef',
  INPI = 'inpi',
  INSEE = 'insee',
  METI = 'meti',
  MI = 'mi',
  VIES = 'vies',
}

/**
 * Validate administration meta data as we load it (during build)
 * @param a
 * @returns
 */
const validateMetaData = (a: IAdministrationMetaData) => {
  const logoTypeIsValid =
    typeof a.logoType === 'undefined' ||
    a.logoType === 'portrait' ||
    a.logoType === 'paysage';

  if (!a.site || !a.long || !a.slug || !logoTypeIsValid) {
    throw new Error('Invalid administrationMetadata : ' + a.slug);
  }

  return a;
};

/**
 * Load meta data. Should only run once
 * @returns
 */
const loadMetadata = (): IAdministrationsMetaData => {
  const metadata = {} as { [k: string]: IAdministrationMetaData };

  Object.values(EAdministration).forEach((k) => {
    const data = require(`../../data/administrations/${k.toString()}.yml`);

    metadata[k] = validateMetaData(data);
  });
  return metadata;
};

export const administrationsMetaData = loadMetadata();

export interface IAdministrationsMetaData {
  [key: string]: IAdministrationMetaData;
}
export interface IAdministrationMetaData {
  long: string;
  short: string;
  logoType: 'portrait' | 'paysage' | null;
  slug: string;
  description: string;
  contact: string;
  site: string;
  apiMonitors?: IAPIMonitorMetaData[];
  datagouv?: { label: string; link: string }[];
  data?: string[];
}

export interface IAPIMonitorMetaData {
  id: number;
  apigouvLink?: string;
  datagouv?: { label: string; link: string }[];
  apiName: string;
  data: string[];
}

export const allMonitoringIds = () =>
  Object.values(administrationsMetaData).reduce((acc, administration) => {
    (administration.apiMonitors || []).forEach((monitor) => {
      //@ts-ignore
      acc.push(monitor.id);
    });
    return acc;
  }, []) as number[];
