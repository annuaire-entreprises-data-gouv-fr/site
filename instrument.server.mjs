import { init } from "@sentry/tanstackstart-react";
import crawlers from "crawler-user-agents";

const IGNORED_SERVER_EXCEPTION_NAMES = new Set([
  "SirenNotFoundOrInvalid",
  "FetchUniteLegaleRechercheException",
  "RefreshingInseeToken",
  "RefreshingAgentMonitoringList",
]);

const getOriginalExceptionName = (exception) => {
  if (
    typeof exception === "object" &&
    exception !== null &&
    "name" in exception
  ) {
    return exception.name;
  }
};

const shouldIgnoreServerException = (event, originalException) => {
  const originalExceptionName = getOriginalExceptionName(originalException);
  if (
    typeof originalExceptionName === "string" &&
    IGNORED_SERVER_EXCEPTION_NAMES.has(originalExceptionName)
  ) {
    return true;
  }

  return (event.exception?.values ?? []).some(
    (exception) =>
      exception.type && IGNORED_SERVER_EXCEPTION_NAMES.has(exception.type)
  );
};

const isUserAgentABot = (userAgent) => {
  if (!userAgent) {
    return false;
  }

  return crawlers.some(
    (crawler) =>
      new RegExp(crawler.pattern).test(userAgent) ||
      new RegExp(crawler.pattern.toLocaleLowerCase()).test(userAgent)
  );
};

export const isSentryActivated =
  !!process.env.VITE_SENTRY_DSN && process.env.NODE_ENV === "production";

if (isSentryActivated) {
  init({
    dsn: process.env.VITE_SENTRY_DSN,
    initialScope: {
      tags: {
        "app.runtime": "server",
      },
    },
    tracesSampleRate: 0.005,
    maxBreadcrumbs: 0, // dont log breadcrumb
    beforeSend(event, hint) {
      // Grouping logic for custom exceptions
      const originalException = hint.originalException;
      if (shouldIgnoreServerException(event, originalException)) {
        return null;
      }

      if (
        // The exception is an instance of our custom Exception class
        // (instanceof does not work in this case)
        typeof originalException === "object" &&
        originalException &&
        "context" in originalException &&
        "name" in originalException
      ) {
        const name = originalException.name;
        const message =
          "message" in originalException ? originalException.message : "";
        event.fingerprint = [name, message];
      }

      if (!event.request) {
        return event;
      }

      const headers = Object.entries(event.request.headers ?? {}).filter(
        // Remove sensitive headers
        ([_key, value]) =>
          !value.match(
            // IP adress regex
            /(\b25[0-5]|\b2[0-4][0-9]|\b[01]?[0-9][0-9]?)(\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}/
          )
      );
      event.request.headers = Object.fromEntries(headers);

      if (!event.tags) {
        event.tags = {};
      }
      event.tags.is_bot = isUserAgentABot(
        event.request.headers["user-agent"] ?? ""
      );

      return event;
    },
  });
}
