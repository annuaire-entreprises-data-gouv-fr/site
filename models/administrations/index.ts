import { EAdministration } from './EAdministration';
import {
  IAPIMonitorMetaData,
  IAdministrationMetaData,
  IAdministrationsMetaData,
} from './types';

/**
 * Validate administration meta data as we load it (during build)
 * @param a
 * @returns
 */
const validateMetaData = (
  a: IAdministrationMetaData,
  administrationEnum: EAdministration
) => {
  const logoTypeIsValid =
    typeof a.logoType === 'undefined' ||
    a.logoType === 'portrait' ||
    a.logoType === 'paysage';

  if (!a.site || !a.long || !a.slug || !logoTypeIsValid) {
    throw new Error('Invalid administrationMetadata : ' + a.slug);
  }

  return {
    // default values
    ...{
      estServicePublic: true,
      apiMonitors: [],
      dataSources: [],
      administrationEnum,
    },
    ...a,
  };
};

/**
 * Load meta data. Should only run once
 * @returns
 */
const loadMetadata = (): IAdministrationsMetaData => {
  const metadata = {} as { [k: string]: IAdministrationMetaData };

  Object.values(EAdministration).forEach((administrationEnum) => {
    const data = require(`../../data/administrations/${administrationEnum.toString()}.yml`);

    metadata[administrationEnum] = validateMetaData(data, administrationEnum);
  });
  return metadata;
};

/**
 * Load list of all apis. Should run once
 * @returns
 */
const loadAllAPI = () =>
  Object.values(administrationsMetaData).reduce((acc, administration) => {
    (administration.apiMonitors || []).forEach((monitor) => {
      //@ts-ignore
      acc[monitor.apiSlug] = monitor;
    });
    return acc;
  }, {}) as { [id: string]: IAPIMonitorMetaData };

export const administrationsMetaData: IAdministrationsMetaData = loadMetadata();

export const allAPI = loadAllAPI();
