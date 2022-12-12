import { clientMonitorings } from '#clients/monitoring';
import {
  administrationsMetaData,
  IAdministrationMetaData,
  IAPIMonitorMetaData,
} from '#models/administrations';
import logErrorInSentry from '#utils/sentry';

export interface IRatio {
  ratio: string;
  isActive: boolean;
  date?: string;
}
export interface IMonitoring {
  id: number;
  isOnline: boolean;
  uptime: {
    day: string;
    week: string;
    month: string;
    trimester: string;
  };
  series: IRatio[];
}

const getMonitorings = async (
  monitoringIds: number[]
): Promise<IMonitoring[]> => {
  try {
    return await clientMonitorings(monitoringIds);
  } catch (e: any) {
    logErrorInSentry('Error while fetching monitoring', {
      details: e.message,
    });
    return [];
  }
};

/**
 * Merge Administration & API Monitoring
 */

const administrationsWithMonitors = Object.values(
  administrationsMetaData
).filter((administration) => !!administration.apiMonitors);

const allMonitorsMetaData = administrationsWithMonitors.reduce(
  (allApiMonitors: IAPIMonitorMetaData[], admin: IAdministrationMetaData) => {
    return [...allApiMonitors, ...(admin.apiMonitors || [])];
  },
  []
);

export const getMonitorsWithMetaData = async (
  monitorsMetaData: IAPIMonitorMetaData[]
) => {
  const monitoringsFromUptimeRobot = await getMonitorings(
    monitorsMetaData.map((monitor) => monitor.id)
  );

  return monitorsMetaData.map((metaData) => {
    const monitoring = monitoringsFromUptimeRobot.find(
      (monitor) => monitor.id === metaData.id
    );

    const admin = administrationsWithMonitors.find(
      (admin) =>
        (admin.apiMonitors || []).find(
          (monitor) => monitor.id === metaData.id
        ) !== undefined
    );

    if (!admin) {
      throw new Error('Should not happen');
    }

    return {
      ...monitoring,
      short: admin.short,
      apigouvLink: metaData.apigouvLink || null,
      datagouv: metaData.datagouv || null,
      apiName: metaData.apiName,
      id: metaData.id || null,
      slug: admin.slug,
      data: metaData.data || [],
    };
  });
};

export const getAllMonitorsWithMetaData = () =>
  getMonitorsWithMetaData(allMonitorsMetaData);
