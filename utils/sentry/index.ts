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
  });
  _isInitialized = true;
};

const logInSentryFactory =
  (severity = 'error' as SeverityLevel) =>
  (errorMsg: any, extra: IScope = {}) => {
    console.error(errorMsg, JSON.stringify(extra));
    return;
    // if (process.env.NODE_ENV === 'development' || !process.env.SENTRY_DSN) {
    //   console.error(errorMsg, JSON.stringify(extra));
    // }
    // if (process.env.NODE_ENV === 'production' && process.env.SENTRY_DSN) {
    //   init();
    //   const scope = getScope(extra || {});
    //   scope.setLevel(severity);

    //   if (typeof errorMsg === 'string') {
    //     Sentry.captureMessage(errorMsg, scope);
    //   } else {
    //     Sentry.captureException(errorMsg, scope);
    //   }
    // }
  };

export const logWarningInSentry = logInSentryFactory('info' as SeverityLevel);

export const logErrorInSentry = logInSentryFactory('error' as SeverityLevel);

export default logErrorInSentry;
