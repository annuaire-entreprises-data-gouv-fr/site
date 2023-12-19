import routes from '#clients/routes';
import constants from '#models/constants';
import { FetchRessourceException } from '#models/exceptions';
import { readFromGrist } from '#utils/integrations/grist';
import { httpGet } from '#utils/network';

export type IMatomoStats = {
  visits: {
    label: string;
    number: number;
    visitReturning: number;
    visitUnknown: number;
    visitorReturning: number;
    visitorUnknown: number;
  }[];
  monthlyNps: {
    label: string;
    number: number;
    values: {
      [key: string]: {
        nps: number | null;
        count: number | null;
        avg: number | null;
      };
    };
  }[];
  userResponses: { [key: string]: number };
  mostCopied: { label: string; count: number }[];
  copyPasteAction: { value: number; label: string }[];
  redirectedSiren: { value: number; label: string }[];
};

const getLabel = (labelAsString: string, index: number) => {
  if (
    labelAsString.indexOf('SIRE') === 0 ||
    labelAsString.indexOf('Siren') === 0
  ) {
    return 'Siret ou siren';
  } else if (
    labelAsString.indexOf('Dénom') === 0 ||
    labelAsString.indexOf('Nom de l’établissement') === 0 ||
    labelAsString.indexOf('Enseigne') === 0
  ) {
    return 'Dénomination ou enseigne';
  } else if (
    labelAsString.indexOf('Prénoms') === 0 ||
    labelAsString.indexOf('Prénom') === 0 ||
    labelAsString.indexOf('Nom') === 0
  ) {
    return 'Prénom ou nom du dirigeant';
  } else if (labelAsString.indexOf('Adresse') === 0) {
    return 'Adresse';
  } else if (labelAsString.indexOf('NAF/APE') > -1) {
    return 'Code NAF/APE';
  } else if (index > 7) {
    return 'Autre';
  }
  return labelAsString;
};

type IMatomoMonthlyStat = {
  nb_uniq_visitors_new: number;
  nb_uniq_visitors_returning: number;
  nb_visits_new: number;
  nb_visits_returning: number;
};

type IMatomoEventStat = { label: string; nb_events: number };

/**
 * Turns matomo response into monthly stats
 */
const computeStats = (
  matomoMonthlyStats: IMatomoMonthlyStat[],
  matomoCopyPasteEventStats: IMatomoEventStat[],
  matomoEventsCategory: IMatomoEventStat[][]
) => {
  const visits = [] as IMatomoStats['visits'];
  const redirectedSiren = [] as IMatomoStats['redirectedSiren'];
  const copyPasteAction = [] as IMatomoStats['copyPasteAction'];

  lastTwelveMonths().forEach(({ label, number }, index) => {
    const {
      nb_visits_returning,
      nb_visits_new,
      nb_uniq_visitors_returning,
      nb_uniq_visitors_new,
    } = matomoMonthlyStats[index];

    visits.push({
      number,
      label,
      visitReturning: nb_visits_returning,
      visitUnknown: nb_visits_new,
      visitorReturning: nb_uniq_visitors_returning,
      visitorUnknown: nb_uniq_visitors_new,
    });

    redirectedSiren.push({
      label,
      value:
        matomoEventsCategory[index].find(
          (e) => e.label === 'research:redirected'
        )?.nb_events || 0,
    });

    copyPasteAction.push({
      label,
      value:
        matomoEventsCategory[index].find((e) => e.label === 'action')
          ?.nb_events || 0,
    });
  });

  const mostCopiedAggregator = {} as { [key: string]: number };

  matomoCopyPasteEventStats.forEach((copyPasteStat, index) => {
    const label = getLabel(copyPasteStat.label, index);
    mostCopiedAggregator[label] =
      (mostCopiedAggregator[label] || 0) + copyPasteStat.nb_events;
  });

  const mostCopied = Object.keys(mostCopiedAggregator)
    .reduce((acc: { label: string; count: number }[], key) => {
      if (key !== 'Autre') {
        acc.push({ label: key, count: mostCopiedAggregator[key] });
      }
      return acc;
    }, [])
    .sort((a, b) => b.count - a.count);

  mostCopied.push({ label: 'Autre', count: mostCopiedAggregator['Autre'] });

  return {
    copyPasteAction,
    mostCopied,
    redirectedSiren,
    visits,
  };
};

export const clientMatomoStats = async (): Promise<IMatomoStats> => {
  try {
    const [
      matomoMonthlyStats,
      matomoCopyPasteEventStats,
      matomoEventsCategory,
      npsRecords,
    ] = await Promise.all([
      httpGet<IMatomoMonthlyStat[]>(createPageViewUrl(), {
        timeout: constants.timeout.XXL,
      }),
      httpGet<IMatomoEventStat[]>(createCopyPasteEventUrl(), {
        timeout: constants.timeout.XXL,
      }),
      httpGet<IMatomoEventStat[][]>(createEventsCategoryUrl(), {
        timeout: constants.timeout.XXL,
      }),
      getNpsRecords(),
    ]);

    return {
      ...computeStats(
        matomoMonthlyStats,
        matomoCopyPasteEventStats,
        matomoEventsCategory
      ),
      ...npsRecords,
    };
  } catch (e: any) {
    throw new FetchRessourceException({
      ressource: 'MatomoStats',
      cause: e,
    });
  }
};

/**
 * API URL Builder
 */

/**
 * Compute matomo API url to extract page view count
 */
const createPageViewUrl = () => {
  let baseUrl = routes.tooling.matomo.report.bulkRequest;
  lastTwelveMonths().forEach((month, index) => {
    baseUrl += `&urls[${index}]=`;
    const subRequest = `idSite=145&period=month&method=VisitFrequency.get&module=VisitFrequency&date=${month.firstDay}`;

    baseUrl += encodeURIComponent(subRequest);
  });

  return baseUrl;
};

const createEventsCategoryUrl = () => {
  let baseUrl = routes.tooling.matomo.report.bulkRequest;
  lastTwelveMonths().forEach((month, index) => {
    baseUrl += `&urls[${index}]=`;
    const subRequest = `idSite=145&period=month&method=Events.getCategory&module=API&date=${month.firstDay}`;
    baseUrl += encodeURIComponent(subRequest);
  });
  return baseUrl;
};

/**
 * Fetch from Grist and then aggregate event by month and userType
 */
const getNpsRecords = async () => {
  const npsRecords = await readFromGrist('nps-feedbacks');

  const months: {
    [monthKey: string]: { [userTypeKey: string]: number[] };
  } = {};

  const totals: {
    [userTypeKey: string]: number;
  } = {};

  let totalAll = 0;

  npsRecords.forEach((record) => {
    const mood = parseInt(record.mood, 10);

    if (mood === -1 || isNaN(mood)) {
      return;
    }

    const date = new Date(record.date);
    const monthLabel = getMonthLabelFromDate(date);

    let userType = record.visitorType;
    if (userType === 'Non renseigné') {
      userType = 'Autre';
    }

    if (!months[monthLabel]) {
      months[monthLabel] = {};
    }
    if (!months[monthLabel][userType]) {
      months[monthLabel][userType] = [];
    }
    if (!months[monthLabel]['all']) {
      months[monthLabel]['all'] = [];
    }

    months[monthLabel][userType].push(mood);
    months[monthLabel]['all'].push(mood);

    (totals[userType] = (totals[userType] || 0) + 1), (totalAll += 1);
  });

  const nps = { months, totals };
  const npsData: any = {};

  for (const month in nps.months) {
    for (const userTypeKey in nps.months[month]) {
      const ratings = nps.months[month][userTypeKey];
      const count = ratings.length;

      const promoters = ratings.filter((e) => e > 8).length;
      const detractors = ratings.filter((e) => e < 7).length;
      const npsFormula = Math.round(((promoters - detractors) / count) * 100);

      const avgRaw = ratings.reduce((sum, el = 0) => sum + el, 0) / count;
      const avg = Math.max(1, Math.round(avgRaw * 10)) / 10;
      npsData[month] = npsData[month] || {};
      npsData[month][userTypeKey] = {
        avg,
        count,
        nps: npsFormula,
      };
    }
  }

  const monthlyNps: IMatomoStats['monthlyNps'] = [];
  lastTwelveMonths().forEach(({ label, number }) => {
    monthlyNps.push({
      number,
      label,
      values: npsData[label],
    });
  });
  return { monthlyNps, userResponses: nps.totals };
};

const createCopyPasteEventUrl = () => {
  const lastYear = getLastYear();
  const dateRange = `${YYYYMMDD(lastYear)},${YYYYMMDD(new Date())}`;
  return routes.tooling.matomo.report.copyPasteEvents + dateRange;
};

/**
 * Dates Helpers
 */

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
  const options = { month: 'long', year: 'numeric', timeZone: 'UTC' } as any;
  return new Intl.DateTimeFormat('fr-FR', options).format(d);
};

/**
 * Last 12 months
 */
const lastTwelveMonths = () => {
  const lastYear = getLastYear();
  const months = [];
  for (let i = 0; i < 12; i++) {
    lastYear.setMonth(lastYear.getMonth() + 1);
    const monthLabel = getMonthLabelFromDate(lastYear);
    months.push({
      label: monthLabel,
      number: lastYear.getMonth() + 1,
      firstDay: YYYYMMDD(lastYear),
    });
  }
  return months;
};
