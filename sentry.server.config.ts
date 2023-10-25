import * as Sentry from '@sentry/nextjs';
import { isSentryActivated } from '#utils/sentry';
if (isSentryActivated) {
  Sentry.init({
    dsn: process.env.SENTRY_DSN,
    tracesSampleRate: 0.1,
    maxBreadcrumbs: 0, // dont log breadcrumb
  });
}
