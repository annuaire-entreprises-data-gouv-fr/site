import { httpGet } from '../../utils/network';
import logErrorInSentry from '../../utils/sentry';

export interface IMatomoStat {
  label: string;
  number: number;
  visits: number;
  nps: number;
}

const getLastYear = () => {
  const now = new Date();
  now.setFullYear(now.getFullYear() - 1);
  now.setDate(1);
  return now;
};

const YYYYMMDD = (d: Date) => d.toISOString().split('T')[0];

const createPageViewBulkRequest = () => {
  let baseUrl =
    'https://stats.data.gouv.fr/index.php?module=API&method=API.getBulkRequest&format=json';

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

const getMonthLabelFromDate = (d: Date) => {
  const options = { month: 'long', year: 'numeric' } as any;
  return new Intl.DateTimeFormat('fr-FR', options).format(d);
};

const createEventRequest = () => {
  const lastYear = getLastYear();

  return `https://stats.data.gouv.fr/index.php?module=API&format=json&idSite=145&period=range&method=Events.getNameFromCategoryId&idSubtable=4&module=API&date=${YYYYMMDD(
    lastYear
  )},${YYYYMMDD(new Date())}&showColumns=label,nb_events&filter_limit=9999`;
};

const computeStats = (
  matomoMonthlyStats: { value: number }[],
  matomoEventStats: { label: string; nb_events: number }[]
) => {
  const lastYear = getLastYear();
  const stats = [];
  const months = {} as { [key: string]: { nps: number; count: number } };

  matomoEventStats.forEach((stat) => {
    const responses = stat.label.split('&');
    const mood = parseInt(responses[0].replace('mood=', ''), 10);
    // const type = responses[1].replace('type=', '');
    // const origin = responses[2].replace('origin=', '');
    const date = new Date(responses[3].replace('date=', ''));

    const monthLabel = getMonthLabelFromDate(date);

    // migration from 10-based nps to 5 based on 2022-01-30
    const nps = date < new Date('2022-01-30') ? Math.round(mood / 2) : mood;

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

  for (let i = 0; i < 12; i++) {
    lastYear.setMonth(lastYear.getMonth() + 1);

    const monthLabel = getMonthLabelFromDate(lastYear);

    // getMonth is 0-indexed
    stats.push({
      number: lastYear.getMonth() + 1,
      label: monthLabel,
      visits: matomoMonthlyStats[i].value,
      nps: Math.round((months[monthLabel].nps * 100) / 5),
      npsResponses: months[monthLabel].count,
    });
  }

  return stats;
};

export const getMatomoStats = async (): Promise<IMatomoStat[]> => {
  try {
    const [matomoMonthlyStats, matomoEventStats] = await Promise.all([
      httpGet(createPageViewBulkRequest()),
      httpGet(createEventRequest()),
    ]);

    return computeStats(matomoMonthlyStats.data, matomoEventStats.data);
  } catch (e: any) {
    logErrorInSentry('Failed to compute matomo stats', {
      details: e.toString(),
    });
    return [];
  }
};
