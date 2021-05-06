import { IMonitoring } from '../../models/monitoring';
import { fetchWithTimeout } from '../../utils/network/fetch-with-timeout';
import routes from '../routes';
interface IRatioUptime {
  ratio: string;
  date?: string;
  label: 'success' | 'warning' | 'black';
}

interface IUptimeRobotResponse {
  status: string;
  monitor: {
    responseTimes: { value: number; datetime: string }[];
    '7dRatio': IRatioUptime;
    '1dRatio': IRatioUptime;
    '30dRatio': IRatioUptime;
    '90dRatio': IRatioUptime;
    dailyRatios: IRatioUptime[];
  };
  days: string[];
}

export const fetchApiMonitoring = async (apiSlug: string) => {
  const response = await fetchWithTimeout(
    routes.monitoring.uptimeRobot + apiSlug
  );

  const result = (await response.json()) as IUptimeRobotResponse;

  return mapToDomainObject(result);
};

const mapToDomainObject = (result: IUptimeRobotResponse): IMonitoring => {
  const dayCursor = new Date();
  const days = result.monitor.dailyRatios;
  days.forEach((dayRatio) => {
    dayRatio['date'] = new Intl.DateTimeFormat('fr-FR').format(dayCursor);
    dayCursor.setDate(dayCursor.getDate() - 1);
  });

  return {
    isOnline: result.status === 'ok',
    uptime: {
      day: result.monitor['1dRatio'].ratio,
      week: result.monitor['7dRatio'].ratio,
      month: result.monitor['30dRatio'].ratio,
      trimester: result.monitor['90dRatio'].ratio,
    },
    series: days.reverse(),
  };
};
