import { EAdministration } from './EAdministration';
import { IAdministrationMetaData, IAdministrationsMetaData } from './types';

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
    ...{ apiMonitors: [], dataSources: [], administrationEnum },
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
 * Load list of all api monitoring id. Should run once
 * @returns
 */
const loadMonitoringIds = () =>
  Object.values(administrationsMetaData).reduce((acc, administration) => {
    (administration.apiMonitors || []).forEach((monitor) => {
      //@ts-ignore
      acc.push(monitor.id);
    });
    return acc;
  }, []) as number[];

export const administrationsMetaData: IAdministrationsMetaData = loadMetadata();

export const allData = Object.values(administrationsMetaData).flatMap(
  ({ dataSources, contact, site, long, short }) => {
    return dataSources.flatMap((datasource) => {
      return (datasource.data || []).map(
        ({ label, form = '', targets = [] }) => {
          return {
            label: label,
            dataSource: datasource.label,
            datagouvLink: datasource.datagouvLink,
            targets,
            form,
            contact,
            site,
            long,
            short,
          };
        }
      );
    });
  }
);

export const allMonitoringIds = loadMonitoringIds();
