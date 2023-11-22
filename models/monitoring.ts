import { clientMonitoring } from '#clients/monitoring';
import logErrorInSentry from '#utils/sentry';
import { EAdministration, administrationsMetaData } from './administrations';

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

  const allMonitorings = await Promise.all(
    Object.values(administrationsMetaData).reduce(
      (
        aggregator: Promise<IMonitoringWithMetaData>[],
        { apiMonitors = [], administrationEnum }
      ) => {
        aggregator = [
          ...aggregator,
          ...apiMonitors
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
                  logErrorInSentry(e, {
                    errorName: 'Error while fetching monitoring',
                    details: apiName || '',
                  });
                  throw e;
                }
              }
            ),
        ];
        return aggregator;
      },
      []
    )
  );

  allMonitorings.forEach((monitorings) => {
    allMonitoringsByAdministration[monitorings.administrationEnum] = [
      ...(allMonitoringsByAdministration[monitorings.administrationEnum] || []),
      monitorings,
    ];
  });

  return allMonitoringsByAdministration;
};
