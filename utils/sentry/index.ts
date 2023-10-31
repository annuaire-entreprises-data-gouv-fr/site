import * as Sentry from '@sentry/nextjs';
import { SeverityLevel } from '@sentry/nextjs';

export type IScope = {
  page?: string;
  siret?: string;
  siren?: string;
  slug?: string;
  details?: string;
  referrer?: string;
  errorName?: string;
  browser?: string;
};

// scope allows to log stuff in tags in sentry
const getScope = (extra: IScope) => {
  const scope = new Sentry.Scope();
  Object.keys(extra).forEach((key) => {
    try {
      //@ts-ignore
      const value = (extra[key] || 'N/A').substring(0, 195);
      scope.setTag(key, value);
    } catch {
      scope.setTag(key, 'Serialization failed');
    }
  });
  if (process.env.INSTANCE_NUMBER) {
    scope.setTag('instance_number', process.env.INSTANCE_NUMBER);
  }
  return scope;
};

export const isNextJSSentryActivated =
  process.env.NODE_ENV === 'production' && !!process.env.NEXT_PUBLIC_SENTRY_DSN;

const logInSentryFactory =
  (severity = 'error' as SeverityLevel) =>
  (errorMsg: any, extra: IScope = {}) => {
    if (extra.errorName && typeof errorMsg !== 'string') {
      const originalErrorName = errorMsg.name;
      errorMsg.name = extra.errorName;
      extra.errorName = originalErrorName;
    }
    if (isNextJSSentryActivated) {
      const scope = getScope(extra || {});
      scope.setLevel(severity);

      if (typeof errorMsg === 'string') {
        Sentry.captureMessage(errorMsg, scope);
      } else {
        Sentry.captureException(errorMsg, scope);
      }
    } else {
      console.error(errorMsg, JSON.stringify(extra));
    }
  };

export const logWarningInSentry = logInSentryFactory('info' as SeverityLevel);

export const logErrorInSentry = logInSentryFactory('error' as SeverityLevel);

export const logFatalErrorInSentry = logInSentryFactory(
  'fatal' as SeverityLevel
);

export default logErrorInSentry;
