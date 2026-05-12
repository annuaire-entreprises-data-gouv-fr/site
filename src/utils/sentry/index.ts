import {
  captureException,
  type Scope,
  type SeverityLevel,
  withScope,
} from "@sentry/tanstackstart-react";
import { type Exception, FetchRessourceException } from "#/models/exceptions";

// scope allows to log stuff in tags in sentry
function getScope(exception: Exception, scope: Scope) {
  Object.entries(exception.context).forEach(([key, value]) => {
    try {
      value = (value || "N/A").slice(0, 195);
      scope.setTag(key, value);
    } catch {
      scope.setTag(key, "Serialization failed");
    }
  });
  if (exception instanceof FetchRessourceException) {
    scope.setTag("administration", exception.administration);
  }

  return scope;
}

export const isSentryActivated =
  !!process.env.VITE_SENTRY_DSN && process.env.NODE_ENV === "production";

const logInSentryFactory =
  (severity: SeverityLevel) => (exception: Exception) => {
    if (isSentryActivated) {
      withScope((scope) => {
        const sentryScope = getScope(exception, scope);
        sentryScope.setLevel(severity);
        captureException(exception, sentryScope);
      });
    } else if (["fatal", "error"].indexOf(severity) > -1) {
      console.error(exception, JSON.stringify(exception.context));
    } else {
      console.warn(exception, JSON.stringify(exception.context));
    }
  };

export const logInfoInSentry = logInSentryFactory("info");
export const logWarningInSentry = logInSentryFactory("warning");
export const logErrorInSentry = logInSentryFactory("error");
export const logFatalErrorInSentry = logInSentryFactory("fatal");

export default logErrorInSentry;
