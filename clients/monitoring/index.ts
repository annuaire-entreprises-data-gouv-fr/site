import { IMonitoring } from '../../models/monitoring';
import { fetchWithTimeout } from '../../utils/network/fetch-with-timeout';
import routes from '../routes';

export interface IUpptimeSummaryResponse {
  status: 'up' | 'down';
  slug: string;
  uptime: string;
  uptimeDay: string;
  uptimeWeek: string;
  uptimeMonth: string;
  uptimeYear: string;
  time: number;
  timeDay: number;
  timeWeek: number;
  timeMonth: number;
  timeYear: number;
  dailyMinutesDown: { [key: string]: number };
}

export const fetchApiMonitoringSummary = async () => {
  const response = await fetchWithTimeout(routes.monitoring.summary);

  //@ts-ignore
  const results = (await response.json()) as IUpptimeSummaryResponse[];

  return mapToDomainObject(results);
};

const convertMinutesToSeries = (minutesDown: { [key: string]: number }) => {
  const series = { month: [], week: [], year: [] };
  const now = new Date();
  const lastWeek = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate() - 6
  );
  const lastMonth = new Date(
    now.getFullYear(),
    now.getMonth() - 1,
    now.getDate()
  );
  const lastYear = new Date(
    now.getFullYear() - 1,
    now.getMonth(),
    now.getDate()
  );

  let d = lastYear;
  while (d.getTime() < now.getTime()) {
    d = new Date(d.getFullYear(), d.getMonth(), d.getDate() + 1);
    const yyyymmdd = d.toISOString().split('T')[0];
    const uptime = (1440 - minutesDown[yyyymmdd]) / 1440 || 100;

    //@ts-ignore
    series.year.push(uptime);
    if (d.getTime() > lastMonth.getTime()) {
      //@ts-ignore
      series.month.push(uptime);
    }
    if (d.getTime() > lastWeek.getTime()) {
      //@ts-ignore
      series.week.push(uptime);
    }
  }
  return series;
};

const convertToNumber = (percentage: string) => {
  return parseInt(percentage.replace('%', ''), 10);
};

const mapToDomainObject = (
  results: IUpptimeSummaryResponse[]
): IMonitoring[] => {
  return results.map((result) => {
    return {
      isOnline: result.status === 'up',
      slug: result.slug,
      responseTime: {
        all: result.time,
        day: result.timeDay,
        week: result.timeWeek,
        month: result.timeMonth,
        year: result.timeYear,
      },
      uptime: {
        all: convertToNumber(result.uptime),
        day: convertToNumber(result.uptimeDay),
        week: convertToNumber(result.uptimeWeek),
        month: convertToNumber(result.uptimeMonth),
        year: convertToNumber(result.uptimeYear),
      },
      series: convertMinutesToSeries(result.dailyMinutesDown),
    };
  });
};
