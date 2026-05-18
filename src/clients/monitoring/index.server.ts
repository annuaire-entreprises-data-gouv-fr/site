import { createServerOnlyFn } from "@tanstack/react-start";
import routes from "#/clients/routes";
import constants from "#/models/constants";
import type { IMonitoring, IRatio } from "#/models/monitoring";
import { httpGet } from "#/utils/network";
import { DailyUptimeRatioConverter } from "./series";

export interface IMonitorLog {
  datetime: number; // timestamp in seconds
  duration: number;
  id?: number;
  reason?: {
    code: string;
    detail: string;
  };
  type?: number;
}

export interface IUpdownIODowntimes {
  duration: number; // in seconds
  ended_at: string; // '2023-11-15T23:11:28Z';
  error: string; // 'Response timeout (30 seconds)';
  id: string;
  partial: boolean;
  started_at: string; // '2023-11-15T23:09:17Z';
}

export const clientMonitoring = createServerOnlyFn(
  async (slug: string, startDate: null | number): Promise<IMonitoring> => {
    const url = routes.tooling.monitoring.getBySlug(slug);
    const response = await httpGet<IUpdownIODowntimes[]>(url, {
      headers: {
        "Accept-Encoding": "gzip",
        "X-API-Key": process.env.UPDOWN_IO_API_KEY,
      },
      timeout: constants.timeout.XL,
    });
    return mapToDomainObject(response, startDate);
  }
);

const mapToDomainObject = (
  downtimes: IUpdownIODowntimes[],
  startDate: null | number
): IMonitoring => {
  const from = new Date();
  from.setUTCDate(from.getUTCDate() - 89);
  from.setUTCHours(0);
  from.setUTCMinutes(0);
  from.setUTCSeconds(0);

  const dailySeries = new DailyUptimeRatioConverter(from);
  dailySeries.feed(downtimes);

  const isOnline = downtimes.length > 0 ? downtimes[0].ended_at !== null : true;

  const monitorStartDate = startDate ? new Date(startDate) : null;
  const series = dailySeries.export(monitorStartDate);

  const avg = (ratios: IRatio[]) =>
    ratios.reduce((sum, ratio) => ratio.ratioNumber + sum, 0) / ratios.length;

  return {
    series,
    isOnline,
    uptime: {
      day: avg(series.slice(-1)).toFixed(2),
      week: avg(series.slice(-7)).toFixed(2),
      month: avg(series).toFixed(2),
    },
  };
};
