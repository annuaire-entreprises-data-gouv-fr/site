import { fetchApiMonitoring } from '../clients/monitoring';
import logErrorInSentry from '../utils/sentry';

export interface IRatio {
  ratio: string;
  label: 'success' | 'warning' | 'black';
  date?: string;
}
export interface IMonitoring {
  isOnline: boolean;
  uptime: {
    day: string;
    week: string;
    month: string;
    trimester: string;
  };
  series: IRatio[];
}

const getMonitoring = async (apiSlug: string): Promise<IMonitoring | null> => {
  try {
    return await fetchApiMonitoring(apiSlug);
  } catch (e) {
    logErrorInSentry('Error while fecthing monitoring from uptime robot', {
      details: e.message,
    });
    return null;
  }
};

export default getMonitoring;
