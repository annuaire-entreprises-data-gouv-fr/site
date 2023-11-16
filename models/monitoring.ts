import { clientMonitoring } from '#clients/monitoring';
import logErrorInSentry from '#utils/sentry';
import { administrationsMetaData } from './administrations';
import { IAPINotRespondingError } from './api-not-responding';

export type IRatio = {
  ratioNumber: number;
  ratio: string;
  date?: string;
};
export type IMonitoring = {
  isOnline: boolean;
  uptime: {
    day: string;
    week: string;
    month: string;
  };
  series: IRatio[];
};

export interface IMonitoringWithMetaData extends IMonitoring {
  apigouvLink?: string;
  apiSlug: string;
  apiName: string;
}

export const getMonitorsByAdministration = async (): Promise<{
  [key: string]: (IMonitoringWithMetaData | IAPINotRespondingError)[];
}> => {
  const allMonitoringsByAdministration = {} as {
    [key: string]: (IMonitoringWithMetaData | IAPINotRespondingError)[];
  };

  for (let { apiMonitors = [], administrationEnum } of Object.values(
    administrationsMetaData
  )) {
    const hasMonitors = apiMonitors.filter(({ id }) => !!id).length > 0;
    if (hasMonitors) {
      const monitorings = await Promise.all(
        apiMonitors
          .filter(({ id }) => !!id)
          .map(
            async ({
              id,
              apigouvLink = null,
              apiName = null,
              apiSlug = null,
            }) => {
              try {
                const monitoring = await clientMonitoring(id);
                return {
                  apigouvLink,
                  apiSlug,
                  apiName,
                  administrationEnum,
                  ...monitoring,
                } as IMonitoringWithMetaData;
              } catch (e: any) {
                logErrorInSentry(e, {
                  errorName: 'Error while fetching monitoring',
                });
                throw e;
              }
            }
          )
      );
      allMonitoringsByAdministration[administrationEnum] = monitorings;
    }
  }

  return allMonitoringsByAdministration;
};
