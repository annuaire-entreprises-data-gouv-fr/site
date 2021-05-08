import * as Sentry from '@sentry/node';

export interface IScope {
  page?: string;
  siret?: string;
  siren?: string;
  details?: string;
}

// scope allows to log stuff in tags in sentry
const getScope = (extra: IScope) => {
  const scope = new Sentry.Scope();
  Object.keys(extra).forEach((key) => {
    //@ts-ignore
    const value = key === 'details' ? extra[key] : JSON.stringify(extra[key]);
    scope.setTag(key, value);
  });
  return scope;
};

let _isInitialized = false;

const init = () => {
  if (_isInitialized) {
    return;
  }

  Sentry.init({
    dsn: process.env.SENTRY_DSN,

    // Set tracesSampleRate to 1.0 to capture 100%
    // of transactions for performance monitoring.
    // We recommend adjusting this value in production
    tracesSampleRate: 1.0,
  });
  _isInitialized = true;
};

export const logWarningInSentry = (message: string, extra?: IScope) => {
  if (process.env.NODE_ENV === 'production' && process.env.SENTRY_DSN) {
    init();

    const scope = getScope(extra || {});
    scope.setLevel(Sentry.Severity.Info);
    Sentry.captureMessage(message, scope);
  }
};

export const logErrorInSentry = (errorMsg: any, extra?: IScope) => {
  init();
  if (process.env.NODE_ENV === 'production' && process.env.SENTRY_DSN) {
    const scope = getScope(extra || {});
    Sentry.captureException(errorMsg, scope);
  }
};

export default logErrorInSentry;
