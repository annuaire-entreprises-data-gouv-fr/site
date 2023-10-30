import { isNextJSSentryActivated } from '#utils/sentry';
import * as Sentry from '@sentry/nextjs';
if (isNextJSSentryActivated) {
  Sentry.init({
    dsn: process.env.SENTRY_DSN,
    tracesSampleRate: 0.1,
    maxBreadcrumbs: 0, // dont log breadcrumb
  });
}
