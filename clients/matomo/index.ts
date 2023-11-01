import routes from '#clients/routes';
import { httpGet } from '#utils/network';
import logErrorInSentry from '#utils/sentry';

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
        npsResponses: number | null;
      };
    };
  }[];
  userResponses: { [key: string]: { value: number; tooltip: string } };
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

/**
 * Aggregate event by month and userType
 */
const aggregateEvents = (
  matomoEventStats: { label: string; nb_events: number }[][]
) => {
  const months: {
    [monthKey: string]: { [userTypeKey: string]: number[] };
  } = {};

  const totals: {
    [userTypeKey: string]: { value: number; tooltip: string };
  } = {};

  matomoEventStats
    .flatMap((i) => i)
    .forEach((stat) => {
      if (stat.label.indexOf('mood=') === -1) {
        return;
      }

      const responses = stat.label.split('&');
      const mood = parseInt(responses[0].replace('mood=', ''), 10);
      const date = new Date(responses[3].replace('date=', ''));
      const monthLabel = getMonthLabelFromDate(date);

      let userType = responses[1].replace('type=', '');

      // rewrite legacy labels
      if (userType === 'Administration publique') {
        userType = 'Agent public';
      }
      if (userType === 'Entreprise privée') {
        userType = 'Dirigeant';
      }
      if (userType === 'Association') {
        userType = 'Salarié';
      }

      // migration from 10-based nps to 5 based on 2022-01-30, ended on 2022-02-15
      const is5Based =
        date > new Date('2022-01-30') && date < new Date('2022-02-15');
      const nps = is5Based ? mood * 2 : mood;

      if (userType === 'Non renseigné' || nps < 0) {
        return;
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

      months[monthLabel][userType].push(nps);
      months[monthLabel]['all'].push(nps);

      totals[userType] = {
        value: (totals[userType]?.value || 0) + 1,
        tooltip: '',
      };
      totals['all'] = {
        value: (totals['all']?.value || 0) + 1,
        tooltip: '',
      };
    });

  const totalAll = totals['all'].value;
  Object.keys(totals).forEach((userTypeKey) => {
    const percent = Math.floor((totals[userTypeKey].value / totalAll) * 100);

    totals[
      userTypeKey
    ].tooltip = `${totals[userTypeKey].value} réponses (${percent}%)`;
  });

  delete totals['all'];

  return { months, totals };
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
  matomoNpsEventStats: IMatomoEventStat[][],
  matomoCopyPasteEventStats: IMatomoEventStat[],
  matomoEventsCategory: IMatomoEventStat[][]
) => {
  const events = aggregateEvents(matomoNpsEventStats);
  const lastYear = getLastYear();
  const visits = [];
  const redirectedSiren = [];
  /* Currently the only action we have in matomo is copyPaste
   *  https://stats.data.gouv.fr/index.php?module=CoreHome&action=index&idSite=145&period=range&date=previous30#?period=range&date=previous30&idSite=145&category=General_Actions&subcategory=Events_Events
   */
  const copyPasteAction = [];

  const npsData: any = {};
  const monthlyNps: IMatomoStats['monthlyNps'] = [];

  for (const month in events.months) {
    for (const property in events.months[month]) {
      const count = events.months[month][property].length;
      const avg =
        events.months[month][property].reduce((sum, el = 0) => sum + el, 0) /
        count;
      npsData[month] = npsData[month] || {};
      npsData[month][property] = {
        nps: Math.max(1, Math.round(avg * 10)) / 10,
        npsResponses: count,
      };
    }
  }

  for (let i = 0; i < 12; i++) {
    lastYear.setMonth(lastYear.getMonth() + 1);

    const monthLabel = getMonthLabelFromDate(lastYear);

    const {
      nb_visits_returning,
      nb_visits_new,
      nb_uniq_visitors_returning,
      nb_uniq_visitors_new,
    } = matomoMonthlyStats[i];

    // getMonth is 0-indexed
    visits.push({
      number: lastYear.getMonth() + 1,
      label: monthLabel,
      visitReturning: nb_visits_returning,
      visitUnknown: nb_visits_new,
      visitorReturning: nb_uniq_visitors_returning,
      visitorUnknown: nb_uniq_visitors_new,
    });

    redirectedSiren.push({
      label: monthLabel,
      value:
        matomoEventsCategory[i].find((e) => e.label === 'research:redirected')
          ?.nb_events || 0,
    });

    copyPasteAction.push({
      label: monthLabel,
      value:
        matomoEventsCategory[i].find((e) => e.label === 'action')?.nb_events ||
        0,
    });

    monthlyNps.push({
      number: lastYear.getMonth() + 1,
      label: monthLabel,
      values: npsData[monthLabel],
    });
  }

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
    monthlyNps,
    mostCopied,
    redirectedSiren,
    userResponses: events.totals,
    visits,
  };
};

export const clientMatomoStats = async (): Promise<IMatomoStats> => {
  try {
    const [
      matomoMonthlyStats,
      matomoNpsEventStats,
      matomoCopyPasteEventStats,
      matomoEventsCategory,
    ] = await Promise.all([
      httpGet<IMatomoMonthlyStat[]>(createPageViewUrl()),
      getNpsEvent(),
      httpGet<IMatomoEventStat[]>(createCopyPasteEventUrl()),
      httpGet<IMatomoEventStat[][]>(createEventsCategoryUrl()),
    ]);

    return {
      ...computeStats(
        matomoMonthlyStats,
        matomoNpsEventStats,
        matomoCopyPasteEventStats,
        matomoEventsCategory
      ),
    };
  } catch (e: any) {
    logErrorInSentry(e, {
      errorName: 'Failed to compute matomo stats',
    });
    return {
      visits: [],
      monthlyNps: [],
      mostCopied: [],
      copyPasteAction: [],
      redirectedSiren: [],
      userResponses: {},
    };
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
  const lastYear = getLastYear();

  for (let i = 0; i < 12; i++) {
    lastYear.setMonth(lastYear.getMonth() + 1);
    baseUrl += `&urls[${i}]=`;
    const subRequest = `idSite=145&period=month&method=VisitFrequency.get&module=VisitFrequency&date=${YYYYMMDD(
      lastYear
    )}`;

    baseUrl += encodeURIComponent(subRequest);
  }

  return baseUrl;
};

const getEventSubtableIds = async () => {
  let baseUrl = routes.tooling.matomo.report.bulkRequest;
  const lastYear = getLastYear();
  for (let i = 0; i < 12; i++) {
    lastYear.setMonth(lastYear.getMonth() + 1);
    baseUrl += `&urls[${i}]=`;
    const subRequest = `idSite=145&period=month&method=Events.getCategory&module=API&showColumns=idsubtable&secondaryDimension=eventName&date=${YYYYMMDD(
      lastYear
    )}`;
    baseUrl += encodeURIComponent(subRequest);
  }
  const events = await httpGet<unknown[]>(baseUrl);
  const filterCategory = events.map((event: any) => {
    return event.map((ev: any) =>
      ev.segment === 'eventCategory==feedback%3Anps' ? ev.idsubdatatable : null
    );
  });
  const eventSubtableIds = filterCategory
    .map((k: any) => k.filter((e: any) => e !== null))
    .map((a: any) => a[0]);
  return eventSubtableIds;
};

const createEventsCategoryUrl = () => {
  let baseUrl = routes.tooling.matomo.report.bulkRequest;
  const lastYear = getLastYear();
  for (let i = 0; i < 12; i++) {
    lastYear.setMonth(lastYear.getMonth() + 1);
    baseUrl += `&urls[${i}]=`;
    const subRequest = `idSite=145&period=month&method=Events.getCategory&module=API&date=${YYYYMMDD(
      lastYear
    )}`;
    baseUrl += encodeURIComponent(subRequest);
  }
  return baseUrl;
};

/**
 * Compute matomo API url to extract events count
 */
const getNpsEvent = async (): Promise<IMatomoEventStat[][]> => {
  const lastYear = getLastYear();
  const subtableIdsResponse = await getEventSubtableIds();

  let baseUrl = routes.tooling.matomo.report.bulkRequest;

  for (let i = 0; i < 12; i++) {
    lastYear.setMonth(lastYear.getMonth() + 1);
    baseUrl += `&urls[${i}]=`;
    const subRequest = `idSite=145&period=month&method=Events.getNameFromCategoryId&idSubtable=${
      subtableIdsResponse[i]
    }&module=API&showColumns=label,nb_events&filter_limit=9999&date=${YYYYMMDD(
      lastYear
    )}`;

    baseUrl += encodeURIComponent(subRequest);
  }

  return httpGet(baseUrl);
};

const createCopyPasteEventUrl = () => {
  const lastYear = getLastYear();
  const dateRange = `${YYYYMMDD(lastYear)},${YYYYMMDD(new Date())}`;
  return routes.tooling.matomo.report.copyPasteEvents + dateRange;
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
