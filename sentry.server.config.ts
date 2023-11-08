import * as Sentry from '@sentry/nextjs';
import { isNextJSSentryActivated } from '#utils/sentry';
if (isNextJSSentryActivated) {
  Sentry.init({
    dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
    tracesSampleRate: 0.005,
    maxBreadcrumbs: 0, // dont log breadcrumb
  });
}
