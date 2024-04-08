import * as Sentry from '@sentry/nextjs';
import { Exception } from '#models/exceptions';
import { isNextJSSentryActivated } from '#utils/sentry';
import { getTransactionNameFromUrl } from '#utils/sentry/tracing';
import isUserAgentABot from '#utils/user-agent';
declare global {
  interface Window {
    IS_OUTDATED_BROWSER: boolean;
  }
}
if (isNextJSSentryActivated) {
  Sentry.init({
    dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
    tracesSampleRate: 0.005,
    maxBreadcrumbs: 2,

    // An error can be thrown when a fetch request is aborted during a page unload
    // We don't want to log it to sentry so we ignore it.
    ignoreErrors: [/RequestAbortedDuringUnloadException/],

    beforeSend(event, hint) {
      // It is possible for sentry to load and catch errors even when
      // the browser is outdated (doesn't support .? operator)

      // - If the syntax error happens in a separate chunk
      // - If there is no syntax error, but a runtime error happens

      // In these cases, we don't want to log the error to sentry to keep the logs clean.

      if (window.IS_OUTDATED_BROWSER) {
        return null;
      }
      if (hint.originalException instanceof Exception) {
        event.fingerprint = [
          hint.originalException.name,
          hint.originalException.message,
        ];
      }

      if (!event.tags) {
        event.tags = {};
      }
      event.tags['is_bot'] = isUserAgentABot(navigator.userAgent || '');

      return event;
    },

    beforeSendTransaction(event) {
      if (event.transaction && event.transaction.startsWith('/')) {
        event.transaction = getTransactionNameFromUrl(event.transaction);
      }

      return event;
    },
  });
}
