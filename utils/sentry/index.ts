import { CaptureConsole as CaptureConsoleIntegration } from '@sentry/integrations';
import { addGlobalEventProcessor } from '@sentry/nextjs';
import * as Sentry from '@sentry/nextjs';
import { SeverityLevel } from '@sentry/nextjs';

export type IScope = {
  page?: string;
  siret?: string;
  siren?: string;
  slug?: string;
  details?: string;
  referrer?: string;
  browser?: string;
};

// scope allows to log stuff in tags in sentry
const getScope = (extra: IScope) => {
  const scope = new Sentry.Scope();
  Object.keys(extra).forEach((key) => {
    //@ts-ignore
    scope.setTag(key, extra[key] || 'N/A');
  });
  if (process.env.INSTANCE_NUMBER) {
    scope.setTag('instance_number', process.env.INSTANCE_NUMBER);
  }
  return scope;
};

let _isInitialized = false;

export const isSentryInitialized = () => _isInitialized;

const init = () => {
  if (_isInitialized) {
    return;
  }

  Sentry.init({
    dsn: process.env.SENTRY_DSN,
    tracesSampleRate: 0.1,
    maxBreadcrumbs: 0, // dont log breadcrumb
    integrations: [
      new CaptureConsoleIntegration({
        // array of methods that should be captured
        // defaults to ['log', 'info', 'warn', 'error', 'debug', 'assert']
        levels: [],
      }),
    ],
  });
  _isInitialized = true;
};

addGlobalEventProcessor((event: Sentry.Event) => {
  if (event.type === 'transaction') {
    event.transaction = sanitizeTransactionName(event.transaction);
  }
  return event;
});

const sanitizeTransactionName = (transaction?: string) => {
  console.log(transaction);
  const url = 'test';
  return url;
  try {
    if (url.indexOf('/entreprise/') === 0) {
      return '/entreprise/:slug';
    }
    if (url.indexOf('/rechercher/carte') > -1) {
      return '/rechercher/carte';
    } else if (url.indexOf('/rechercher') > -1) {
      return '/rechercher';
    }
    return url.replace('?redirected=1', '').replace(/\d{14}|\d{9}/g, ':slug');
  } catch {
    return url;
  }
};

const logInSentryFactory =
  (severity = 'error' as SeverityLevel) =>
  (errorMsg: any, extra: IScope = {}) => {
    if (process.env.NODE_ENV === 'development' || !process.env.SENTRY_DSN) {
      console.error(errorMsg, JSON.stringify(extra));
    }
    if (process.env.NODE_ENV === 'production' && process.env.SENTRY_DSN) {
      init();
      const scope = getScope(extra || {});
      scope.setLevel(severity);

      if (typeof errorMsg === 'string') {
        Sentry.captureMessage(errorMsg, scope);
      } else {
        Sentry.captureException(errorMsg, scope);
      }
    }
  };

export const logWarningInSentry = logInSentryFactory('info' as SeverityLevel);

export const logErrorInSentry = logInSentryFactory('error' as SeverityLevel);

export default logErrorInSentry;
