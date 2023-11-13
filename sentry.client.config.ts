import * as Sentry from '@sentry/nextjs';
import { isNextJSSentryActivated } from '#utils/sentry';
if (isNextJSSentryActivated) {
  Sentry.init({
    dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
    tracesSampleRate: 0.005,
    maxBreadcrumbs: 2,

    // An error can be thrown when a fetch request is aborted during a page unload
    // We don't want to log it to sentry so we ignore it.
    ignoreErrors: ['RequestAbortedDuringUnloadException'],
  });
}
