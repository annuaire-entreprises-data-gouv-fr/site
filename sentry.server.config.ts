import * as Sentry from '@sentry/nextjs';
import { isNextJSSentryActivated } from '#utils/sentry';
import isUserAgentABot from '#utils/user-agent';
if (isNextJSSentryActivated) {
  Sentry.init({
    dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
    tracesSampleRate: 0.005,
    maxBreadcrumbs: 0, // dont log breadcrumb
    beforeSend(event, hint) {
      // Grouping logic for custom exceptions
      const originalException = hint.originalException;
      if (
        // The exception is an instance of our custom Exception class
        // (instanceof does not work in this case)
        typeof originalException === 'object' &&
        originalException &&
        'context' in originalException &&
        'name' in originalException
      ) {
        const name = originalException.name as string;
        const message =
          'message' in originalException
            ? (originalException.message as string)
            : '';
        event.fingerprint = [name, message];
      }

      if (!event.request) {
        return event;
      }

      const headers = Object.entries(event.request.headers ?? {}).filter(
        // Remove sensitive headers
        ([key, value]) =>
          !value.match(
            // IP adress regex
            /(\b25[0-5]|\b2[0-4][0-9]|\b[01]?[0-9][0-9]?)(\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}/
          )
      );
      event.request.headers = Object.fromEntries(headers);

      if (!event.tags) {
        event.tags = {};
      }
      event.tags['is_bot'] = isUserAgentABot(
        event.request.headers['user-agent'] ?? ''
      );

      return event;
    },
  });
}
