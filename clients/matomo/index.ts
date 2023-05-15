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
  monthlyUserNps: {
    label: string;
    number: number;
    nps: number;
    npsResponses: number;
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
  matomoEventStats: { label: string; nb_events: number }[]
) => {
  const months = {} as {
    [monthKey: string]: { [userTypeKey: string]: number[] };
  };

  const totals = {} as {
    [userTypeKey: string]: { value: number; tooltip: string };
  };

  matomoEventStats.forEach((stat) => {
    if (stat.label.indexOf('mood=') === -1) {
      return;
    }

    const responses = stat.label.split('&');
    const mood = parseInt(responses[0].replace('mood=', ''), 10);
    const userType = responses[1].replace('type=', '');
    const date = new Date(responses[3].replace('date=', ''));
    const monthLabel = getMonthLabelFromDate(date);

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

/**
 * Turns matomo response into monthly stats
 */
const computeStats = (
  matomoMonthlyStats: {
    nb_uniq_visitors_new: number;
    nb_uniq_visitors_returning: number;
    nb_visits_new: number;
    nb_visits_returning: number;
  }[],
  matomoNpsEventStats: { label: string; nb_events: number }[],
  matomoCopyPasteEventStats: { label: string; nb_events: number }[],
  matomoEventsCategory: {
    label: string;
    nb_events: number;
  }[][]
) => {
  const events = aggregateEvents(matomoNpsEventStats);
  const monthlyUserNps = [] as {
    label: string;
    number: number;
    nps: number;
    npsResponses: number;
  }[];
  const lastYear = getLastYear();

  const visits = [];
  const redirectedSiren = [];
  /* Currently the only action we have in matomo is copyPaste
   *  https://stats.data.gouv.fr/index.php?module=CoreHome&action=index&idSite=145&period=range&date=previous30#?period=range&date=previous30&idSite=145&category=General_Actions&subcategory=Events_Events
   */
  const copyPasteAction = [];

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

    const monthlyNps = events.months[monthLabel]['all'];
    if (monthlyNps) {
      const count = monthlyNps.length;
      const avg = monthlyNps.reduce((sum, el = 0) => sum + el, 0) / count;

      monthlyUserNps.push({
        number: lastYear.getMonth() + 1,
        label: monthLabel,
        // prefer display 1 rather than 0
        nps: Math.max(1, Math.round(avg * 10)) / 10,
        npsResponses: monthlyNps.length,
      });
    }
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
    monthlyUserNps,
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
      httpGet(createPageViewUrl()),
      httpGet(createNpsEventUrl()),
      httpGet(createCopyPasteEventUrl()),
      httpGet(createEventsCategoryUrl()),
    ]);

    return {
      ...computeStats(
        matomoMonthlyStats.data,
        matomoNpsEventStats.data,
        matomoCopyPasteEventStats.data,
        matomoEventsCategory.data
      ),
    };
  } catch (e: any) {
    logErrorInSentry('Failed to compute matomo stats', {
      details: e.toString(),
    });
    return {
      visits: [],
      monthlyUserNps: [],
      userResponses: {},
      mostCopied: [],
      copyPasteAction: [],
      redirectedSiren: [],
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
  let baseUrl = routes.matomo.report.bulkRequest;
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

const createEventsCategoryUrl = () => {
  let baseUrl = routes.matomo.report.bulkRequest;
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
const createNpsEventUrl = () => {
  const lastYear = getLastYear();
  const dateRange = `${YYYYMMDD(lastYear)},${YYYYMMDD(new Date())}`;
  return routes.matomo.report.npsEvents + dateRange;
};

const createCopyPasteEventUrl = () => {
  const lastYear = getLastYear();
  const dateRange = `${YYYYMMDD(lastYear)},${YYYYMMDD(new Date())}`;
  return routes.matomo.report.copyPasteEvents + dateRange;
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
