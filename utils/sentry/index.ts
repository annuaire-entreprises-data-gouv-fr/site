import { Exception, FetchRessourceException } from '#models/exceptions';
import * as Sentry from '@sentry/nextjs';
import { SeverityLevel } from '@sentry/nextjs';

// scope allows to log stuff in tags in sentry
function getScope(exception: Exception, scope: Sentry.Scope) {
  Object.entries(exception.context).forEach(([key, value]) => {
    try {
      value = (value || 'N/A').substring(0, 195);
      scope.setTag(key, value);
    } catch {
      scope.setTag(key, 'Serialization failed');
    }
  });
  if (exception instanceof FetchRessourceException) {
    scope.setTag('administration', exception.administration);
  }

  return scope;
}

export const isNextJSSentryActivated =
  !!process.env.NEXT_PUBLIC_SENTRY_DSN && process.env.NODE_ENV === 'production';

const logInSentryFactory =
  (severity: SeverityLevel) => (exception: Exception) => {
    if (isNextJSSentryActivated) {
      Sentry.withScope((scope) => {
        scope = getScope(exception, scope);
        scope.setLevel(severity);
        Sentry.captureException(exception, scope);
      });
    } else {
      if (['fatal', 'error'].indexOf(severity) > -1) {
        console.error(exception, JSON.stringify(exception.context));
      } else {
        console.warn(exception, JSON.stringify(exception.context));
      }
    }
  };

export const logInfoInSentry = logInSentryFactory('info');
export const logWarningInSentry = logInSentryFactory('warning');
export const logErrorInSentry = logInSentryFactory('error');
export const logFatalErrorInSentry = logInSentryFactory('fatal');

export default logErrorInSentry;
