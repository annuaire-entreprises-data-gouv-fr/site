import { httpGet } from '../../utils/network';
import logErrorInSentry from '../../utils/sentry';
import routes from '../routes';

export interface IMatomoStat {
  label: string;
  number: number;
  visits: number;
  nps: number;
}

/**
 * Aggregate event by month
 */
const aggregateEventsByMonths = (
  matomoEventStats: { label: string; nb_events: number }[]
) => {
  const months = {} as { [key: string]: { nps: number; count: number } };

  matomoEventStats.forEach((stat) => {
    const responses = stat.label.split('&');
    const mood = parseInt(responses[0].replace('mood=', ''), 10);
    const date = new Date(responses[3].replace('date=', ''));

    const monthLabel = getMonthLabelFromDate(date);

    // migration from 10-based nps to 5 based on 2022-01-30
    const is5Based =
      date > new Date('2022-01-30') && date < new Date('2022-02-15');

    const nps = is5Based ? mood * 2 : mood;

    if (!months[monthLabel]) {
      months[monthLabel] = {
        nps,
        count: stat.nb_events,
      };
    } else {
      const newCount = months[monthLabel].count + stat.nb_events;
      const newNps =
        (months[monthLabel].count * months[monthLabel].nps + nps) / newCount;

      months[monthLabel] = {
        nps: newNps,
        count: newCount,
      };
    }
  });
  return months;
};

/**
 * Turns matomo response into monthly stats
 */
const computeStats = (
  matomoMonthlyStats: { value: number }[],
  matomoEventStats: { label: string; nb_events: number }[]
) => {
  const eventByMonths = aggregateEventsByMonths(matomoEventStats);
  const stats = [];
  const lastYear = getLastYear();

  for (let i = 0; i < 12; i++) {
    lastYear.setMonth(lastYear.getMonth() + 1);

    const monthLabel = getMonthLabelFromDate(lastYear);

    // getMonth is 0-indexed
    stats.push({
      number: lastYear.getMonth() + 1,
      label: monthLabel,
      visits: matomoMonthlyStats[i].value,
      nps: Math.round(eventByMonths[monthLabel].nps * 100),
      npsResponses: eventByMonths[monthLabel].count,
    });
  }

  return stats;
};

export const getMatomoStats = async (): Promise<IMatomoStat[]> => {
  try {
    const [matomoMonthlyStats, matomoEventStats] = await Promise.all([
      httpGet(createPageViewUrl()),
      httpGet(createEventUrl()),
    ]);

    return computeStats(matomoMonthlyStats.data, matomoEventStats.data);
  } catch (e: any) {
    logErrorInSentry('Failed to compute matomo stats', {
      details: e.toString(),
    });
    return [];
  }
};

/**
 * API URL Builder
 */

/**
 * Compute matomo API url to extract page view count
 */
const createPageViewUrl = () => {
  let baseUrl = routes.matomo.report.visits;
  const lastYear = getLastYear();

  for (let i = 0; i < 12; i++) {
    lastYear.setMonth(lastYear.getMonth() + 1);
    baseUrl += `&urls[${i}]=`;

    const subRequest = `idSite=145&period=month&method=API.get&module=API&showColumns=nb_visits&date=${YYYYMMDD(
      lastYear
    )}`;

    baseUrl += encodeURIComponent(subRequest);
  }
  return baseUrl;
};

/**
 * Compute matomo API url to extract events count
 */
const createEventUrl = () => {
  const lastYear = getLastYear();
  const dateRange = `${YYYYMMDD(lastYear)},${YYYYMMDD(new Date())}`;
  return routes.matomo.report.npsEvents + dateRange;
};

/**
 * Dates Helpers
 * /

/**
 * return the date of the first day of the month, one-year ago
 */
const getLastYear = () => {
  const now = new Date();
  now.setMonth(now.getMonth() - 1);
  now.setFullYear(now.getFullYear() - 1);
  now.setDate(1);
  return now;
};

/**
 * format date as string following format YYYY-MM-DD
 */
const YYYYMMDD = (d: Date) => d.toISOString().split('T')[0];

/**
 * format a date as it's month in french
 */
const getMonthLabelFromDate = (d: Date) => {
  const options = { month: 'long', year: 'numeric' } as any;
  return new Intl.DateTimeFormat('fr-FR', options).format(d);
};
