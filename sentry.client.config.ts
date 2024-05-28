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

      if (
        hint.originalException &&
        typeof hint.originalException === 'object' &&
        'message' in hint.originalException &&
        typeof hint.originalException.message === 'string'
      ) {
        /*
        A LOT of hydration error happens in production. This can be due to a lot of reasons:
        1. Browser code in client SSRed component
        2. Bad nesting of HTML tags (e.g. <p> inside <span>)
        3. User browser extension messing with the DOM

        In any of these case, a unhandled exception is thrown and sentry catches it.
        Only 1 and 2 are fixable. 3 is not. But real world data is not accurate enough to determine which is which.

        For now, we rely on E2E tests to catch those.

        In production, only the minified version of the error is sent to sentry.
        These are the react error numbers that we want to ignore:
        - [422](https://react.dev/errors/422)
        - [423](https://react.dev/errors/423)
        - [418](https://react.dev/errors/418)
        - [425](https://react.dev/errors/425)
        */
        if (
          hint.originalException.message.match(
            /Minified React error #(422|423|418|425)/
          )
        ) {
          event.fingerprint = ['React hydration error'];
        }

        /*
        This is a common error that happens when a chunk fails to load. We want to group them together.
        */
        if (
          hint.originalException.message.match(/Loading chunk [\d]+ failed/)
        ) {
          event.fingerprint = ['Chunk load error'];
        }
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
