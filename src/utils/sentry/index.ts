import {
  captureException,
  type Scope,
  type SeverityLevel,
  withScope,
} from "@sentry/tanstackstart-react";
import { type Exception, FetchRessourceException } from "#/models/exceptions";

type SentryExtra = Record<string, unknown>;

// scope allows to log stuff in tags in sentry
function getScope(exception: Exception, scope: Scope, extra?: SentryExtra) {
  for (let [key, value] of Object.entries(exception.context)) {
    try {
      value = (value || "N/A").slice(0, 195);
      scope.setTag(key, value);
    } catch {
      scope.setTag(key, "Serialization failed");
    }
  }
  if (exception instanceof FetchRessourceException) {
    scope.setTag("administration", exception.administration);
  }
  if (extra) {
    for (const [key, value] of Object.entries(extra)) {
      scope.setExtra(key, value);
    }
  }

  return scope;
}

export const isSentryActivated =
  !!import.meta.env.VITE_SENTRY_DSN && process.env.NODE_ENV === "production";

const logInSentryFactory =
  (severity: SeverityLevel) => (exception: Exception, extra?: SentryExtra) => {
    if (isSentryActivated) {
      withScope((scope) => {
        const sentryScope = getScope(exception, scope, extra);
        sentryScope.setLevel(severity);
        captureException(exception, sentryScope);
      });
    } else if (["fatal", "error"].indexOf(severity) > -1) {
      console.error(exception, JSON.stringify(exception.context), extra);
    } else {
      console.warn(exception, JSON.stringify(exception.context), extra);
    }
  };

export const logInfoInSentry = logInSentryFactory("info");
export const logWarningInSentry = logInSentryFactory("warning");
export const logErrorInSentry = logInSentryFactory("error");
export const logFatalErrorInSentry = logInSentryFactory("fatal");

export default logErrorInSentry;
