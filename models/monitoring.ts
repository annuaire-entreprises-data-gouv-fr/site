import { fetchMonitoring, fetchMonitorings } from '../clients/monitoring';
import logErrorInSentry from '../utils/sentry';

export interface IRatio {
  ratio: string;
  isActive: boolean;
  date?: string;
}
export interface IMonitoring {
  isOnline: boolean;
  monitoringId: number;
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

const getMonitoring = async (
  monitoringId: number
): Promise<IMonitoring | null> => {
  try {
    return await fetchMonitoring(monitoringId);
  } catch (e) {
    logError(e);
    return null;
  }
};

const getMonitorings = async (
  monitoringIds: number[]
): Promise<IMonitoring[]> => {
  try {
    return await fetchMonitorings(monitoringIds);
  } catch (e) {
    logError(e);
    return [];
  }
};

export { getMonitoring, getMonitorings };
