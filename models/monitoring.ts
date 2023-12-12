import { clientMonitoring } from '#clients/monitoring';
import { logWarningInSentry } from '#utils/sentry';
import { administrationsMetaData } from './administrations';
import { EAdministration } from './administrations/EAdministration';
import { FetchRessourceException } from './exceptions';

export type IRatio = {
  ratioNumber: number;
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
  administrationEnum: EAdministration;
}

export const getMonitorsByAdministration = async (): Promise<{
  [key: string]: IMonitoringWithMetaData[];
}> => {
  const allMonitoringsByAdministration = {} as {
    [key: string]: IMonitoringWithMetaData[];
  };

  let allMonitorings = [] as IMonitoringWithMetaData[];
  for (const { apiMonitors = [], administrationEnum } of Object.values(
    administrationsMetaData
  )) {
    allMonitorings = [
      ...allMonitorings,
      ...(await Promise.all(
        apiMonitors
          .filter(({ updownIoId }) => !!updownIoId)
          .map(
            async ({
              updownIoId,
              apigouvLink = null,
              apiName = null,
              apiSlug = null,
            }) => {
              try {
                const monitoring = await clientMonitoring(updownIoId);
                return {
                  apigouvLink,
                  apiSlug,
                  apiName,
                  administrationEnum,
                  ...monitoring,
                } as IMonitoringWithMetaData;
              } catch (e: any) {
                const error = new FetchRessourceException({
                  cause: e,
                  ressource: 'ClientMonitoring',
                  context: {
                    details: apiName || '',
                  },
                });
                logWarningInSentry(error);
                throw error;
              }
            }
          )
      )),
    ];
  }

  allMonitorings.forEach((monitorings) => {
    allMonitoringsByAdministration[monitorings.administrationEnum] = [
      ...(allMonitoringsByAdministration[monitorings.administrationEnum] || []),
      monitorings,
    ];
  });

  return allMonitoringsByAdministration;
};
