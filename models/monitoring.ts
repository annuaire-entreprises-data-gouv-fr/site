import { clientMonitorings } from '#clients/monitoring';
import logErrorInSentry from '#utils/sentry';
import { administrationsMetaData } from './administrations';

export type IRatio = {
  ratio: string;
  isActive: boolean;
  date?: string;
};
export type IMonitoring = {
  id: number;
  isOnline: boolean;
  uptime: {
    day: string;
    week: string;
    month: string;
    trimester: string;
  };
  series: IRatio[];
};

export interface IMonitoringWithMetaData extends IMonitoring {
  apigouvLink?: string;
  apiSlug: string;
  apiName: string;
}

const getMonitorings = async (): Promise<IMonitoring[]> => {
  try {
    return await clientMonitorings();
  } catch (e: any) {
    logErrorInSentry(e, {
      errorName: 'Error while fetching monitoring',
    });
    return [];
  }
};

export const getMonitorsByAdministration = async (): Promise<{
  [key: string]: IMonitoringWithMetaData[];
}> => {
  const monitoringsFromUptimeRobot = await getMonitorings();

  return Object.values(administrationsMetaData).reduce(
    (allMonitorsByAdministration, { apiMonitors = [], administrationEnum }) => {
      const administrationMonitors = apiMonitors.map(
        ({ id, apigouvLink = null, apiName = null, apiSlug = null }) => {
          const monitoring = monitoringsFromUptimeRobot.find(
            (monitor) => monitor.id === id
          );

          return {
            apigouvLink,
            apiSlug,
            apiName,
            ...monitoring,
          };
        }
      );

      // @ts-ignore
      allMonitorsByAdministration[administrationEnum] = administrationMonitors;
      return allMonitorsByAdministration;
    },
    {}
  );
};
