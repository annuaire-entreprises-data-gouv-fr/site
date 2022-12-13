import { IMonitoring } from '../../models/monitoring';
import httpClient from '../../utils/network';
import FormData from 'form-data';
import routes from '../routes';
import { DailyUptimeRatioConverter } from './series';
import { allMonitoringIds } from '../../models/administrations';
import constants from '../../models/constants';

export interface IMonitorLog {
  id?: number;
  type?: number;
  datetime: number; // timestamp in seconds
  duration: number;
  reason?: {
    code: string;
    detail: string;
  };
}

interface IUptimeRobotMonitor {
  id: number;
  friendly_name: string;
  create_datetime: number;
  status: number;
  logs: IMonitorLog[];
  all_time_uptime_ratio: string;
  custom_uptime_ratio: string;
  custom_down_durations: string;
}

interface IUptimeRobotResponse {
  stat: 'ok' | 'fail';
  pagination: {
    offset: number;
    limit: number;
    total: number;
  };
  monitors: IUptimeRobotMonitor[];
}

interface IMonitoringCache {
  lastUpdate: number;
  monitorings: IMonitoring[];
}

const cachedMonitorings: IMonitoringCache = {
  lastUpdate: 0,
  monitorings: [],
};

const CACHE_LIFE = 55 * 1000;

export const clientMonitorings = async (
  monitoringIds: number[]
): Promise<IMonitoring[]> => {
  const shouldUpdate =
    new Date().getTime() - cachedMonitorings.lastUpdate > CACHE_LIFE;

  if (shouldUpdate) {
    await updateMonitorings();
  }
  return monitoringIds.map((id) => cachedMonitorings.monitorings[id]);
};

const updateMonitorings = async () => {
  const monitoringIds = allMonitoringIds();

  const data = new FormData();
  const to = new Date();
  const from = new Date();
  from.setUTCDate(to.getUTCDate() - 89);
  from.setUTCHours(0);
  from.setUTCMinutes(0);
  from.setUTCSeconds(0);

  data.append('monitors', monitoringIds.join('-'));
  data.append('logs', '1');
  data.append('format', 'json');
  data.append('custom_uptime_ratios', '1-7-30-90');
  data.append('log_types', '1');
  data.append('logs_end_date', Math.ceil(to.getTime() / 1000));
  data.append('logs_start_date', Math.floor(from.getTime() / 1000));

  const response = await httpClient({
    url: routes.monitoring + `?api_key=${process.env.UPTIME_ROBOT_API_KEY}`,
    method: 'POST',
    data,
    headers: {
      ...data.getHeaders(),
      'Accept-Encoding': 'gzip,deflate,compress',
    },
    timeout: constants.timeout.S,
  });

  const result = response.data as IUptimeRobotResponse;

  result.monitors.forEach((monitor) => {
    cachedMonitorings.monitorings[monitor.id] = mapToDomainObject(
      monitor,
      from
    );
  });
  cachedMonitorings.lastUpdate = new Date().getTime();
};

const mapToDomainObject = (
  monitor: IUptimeRobotMonitor,
  from: Date
): IMonitoring => {
  const createdAt = new Date(monitor.create_datetime * 1000);
  const dailySeries = new DailyUptimeRatioConverter(from, createdAt);
  dailySeries.feed(monitor.logs);

  const uptimeAvg = monitor.custom_uptime_ratio.split('-');
  const isOnline = [8, 9].indexOf(monitor.status) === -1;

  return {
    id: monitor.id,
    series: dailySeries.export(),
    isOnline,
    uptime: {
      day: uptimeAvg[0],
      week: uptimeAvg[1],
      month: uptimeAvg[2],
      trimester: uptimeAvg[3],
    },
  };
};
