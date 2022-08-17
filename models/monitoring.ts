import { fetchMonitorings } from '../clients/monitoring';
import logErrorInSentry from '../utils/sentry';
import {
  administrationsMetaData,
  IAdministrationMetaData,
  IAPIMonitorMetaData,
} from './administration';

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

const logError = (e: Error) =>
  logErrorInSentry('Error while fecthing monitoring', {
    details: e.message,
  });

const getMonitorings = async (
  monitoringIds: number[]
): Promise<IMonitoring[]> => {
  try {
    return await fetchMonitorings(monitoringIds);
  } catch (e: any) {
    logError(e);
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
    return [...allApiMonitors, ...admin.apiMonitors];
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
        admin.apiMonitors.find((monitor) => monitor.id === metaData.id) !==
        undefined
    );

    if (!admin) {
      throw new Error('Should not happen');
    }

    return {
      ...monitoring,
      short: admin.short,
      apiGouvLink: metaData.apiGouvLink || null,
      dataGouvLink: metaData.dataGouvLink || null,
      apiName: metaData.apiName,
      id: metaData.id || null,
      slug: admin.slug,
      data: metaData.data || [],
    };
  });
};

export const getAllMonitorsWithMetaData = () =>
  getMonitorsWithMetaData(allMonitorsMetaData);
