import routes from '#clients/routes';
import constants from '#models/constants';
import { IMonitoring, IRatio } from '#models/monitoring';
import { httpGet } from '#utils/network';
import { DailyUptimeRatioConverter } from './series';

export type IMonitorLog = {
  id?: number;
  type?: number;
  datetime: number; // timestamp in seconds
  duration: number;
  reason?: {
    code: string;
    detail: string;
  };
};

export type IUpdownIODowntimes = {
  id: string;
  error: string; // 'Response timeout (30 seconds)';
  started_at: string; // '2023-11-15T23:09:17Z';
  ended_at: string; // '2023-11-15T23:11:28Z';
  duration: number; // in seconds
  partial: boolean;
};

export const clientMonitoring = async (slug: string): Promise<IMonitoring> => {
  const url = `${routes.tooling.monitoring}/${slug}/downtimes`;
  const response = await httpGet<IUpdownIODowntimes[]>(url, {
    headers: {
      'Accept-Encoding': 'gzip',
      'X-API-Key': process.env.UPDOWN_IO_API_KEY,
    },
    timeout: constants.timeout.XL,
  });
  return mapToDomainObject(response);
};

const mapToDomainObject = (downtimes: IUpdownIODowntimes[]): IMonitoring => {
  const from = new Date();
  from.setUTCDate(from.getUTCDate() - 89);
  from.setUTCHours(0);
  from.setUTCMinutes(0);
  from.setUTCSeconds(0);

  const dailySeries = new DailyUptimeRatioConverter(from);
  dailySeries.feed(downtimes);

  const isOnline = downtimes.length > 0 ? downtimes[0].ended_at !== null : true;

  const series = dailySeries.export();

  const avg = (ratios: IRatio[]) => {
    return (
      ratios.reduce((sum, ratio) => ratio.ratioNumber + sum, 0) / ratios.length
    );
  };

  return {
    series,
    isOnline,
    uptime: {
      day: avg(series.slice(-1)).toFixed(2),
      week: avg(series.slice(- 7)).toFixed(2),
      month: avg(series).toFixed(2),
    },
  };
};
