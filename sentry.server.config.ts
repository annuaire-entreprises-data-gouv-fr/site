import * as Sentry from '@sentry/nextjs';
import { Exception } from '#models/exceptions';
import { isNextJSSentryActivated } from '#utils/sentry';
import isUserAgentABot from '#utils/user-agent';
if (isNextJSSentryActivated) {
  Sentry.init({
    dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
    tracesSampleRate: 0.005,
    maxBreadcrumbs: 0, // dont log breadcrumb
    beforeSend(event, hint) {
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

      if (hint.originalException instanceof Exception) {
        event.fingerprint = [
          hint.originalException.name,
          hint.originalException.message,
        ];
      }

      return event;
    },
  });
}
