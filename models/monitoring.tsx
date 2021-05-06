import { fetchApiMonitoring } from '../clients/monitoring';

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

const getMonitoring = async (apiSlug: string): Promise<IMonitoring> => {
  const monitoring = await fetchApiMonitoring(apiSlug);
  return monitoring;
};

export default getMonitoring;
