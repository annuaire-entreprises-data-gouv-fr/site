import { HttpNotFound } from '../clients/exceptions';
import { fetchApiMonitoringSummary } from '../clients/monitoring';
import { isApiOnline } from '../clients/test';

export interface IMonitoring {
  isOnline: boolean;
  slug: string;
  responseTime: {
    all: number;
    day: number;
    week: number;
    month: number;
    year: number;
  };
  uptime: {
    all: number;
    day: number;
    week: number;
    month: number;
    year: number;
  };
  series: {
    week: number[];
    month: number[];
    year: number[];
  };
}

const getMonitoring = async (apiSlug: string): Promise<IMonitoring> => {
  const summary = await fetchApiMonitoringSummary();

  const monitoring = summary.find(
    (apiMonitoring) => apiMonitoring.slug === apiSlug
  );

  if (monitoring === undefined) {
    throw new HttpNotFound(404, `${apiSlug} monitoring not found`);
  }
  monitoring.isOnline = await isApiOnline(apiSlug);
  return monitoring;
};

export default getMonitoring;
