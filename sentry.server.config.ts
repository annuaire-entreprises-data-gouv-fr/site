import * as Sentry from '@sentry/nextjs';
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
        ([key]) => !key.startsWith('sec-') && !key.startsWith('x-')
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
