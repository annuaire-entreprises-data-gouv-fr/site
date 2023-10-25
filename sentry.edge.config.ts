import * as Sentry from '@sentry/nextjs';
import { isNextJSSentryActivated } from '#utils/sentry';
if (isNextJSSentryActivated) {
  Sentry.init({
    dsn: process.env.SENTRY_DSN,
    tracesSampleRate: 0.1,
    maxBreadcrumbs: 0, // dont log breadcrumb
  });
}
