import * as Sentry from '@sentry/nextjs';
import { SeverityLevel } from '@sentry/nextjs';
import { Exception, FetchRessourceException } from '#models/exceptions';

// scope allows to log stuff in tags in sentry
function getScope(exception: Exception) {
  const scope = new Sentry.Scope();

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
  if (process.env.INSTANCE_NUMBER) {
    scope.setTag('instance_number', process.env.INSTANCE_NUMBER);
  }
  return scope;
}

export const isNextJSSentryActivated =
  process.env.NODE_ENV === 'production' && !!process.env.NEXT_PUBLIC_SENTRY_DSN;

const logInSentryFactory =
  (severity: SeverityLevel) => (exception: Exception) => {
    if (isNextJSSentryActivated) {
      const scope = getScope(exception);
      scope.setLevel(severity);
      Sentry.captureException(exception, scope);
    } else {
      console.error(exception, JSON.stringify(exception.context));
    }
  };

export const logInfoInSentry = logInSentryFactory('info');
export const logWarningInSentry = logInSentryFactory('warning');
export const logErrorInSentry = logInSentryFactory('error');
export const logFatalErrorInSentry = logInSentryFactory('fatal');

export default logErrorInSentry;
