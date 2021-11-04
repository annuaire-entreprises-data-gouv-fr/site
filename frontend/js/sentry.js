import * as Sentry from '@sentry/browser';
var dsn = import.meta.env.VITE_SENTRY_FRONT_DSN;

if (Sentry && dsn) {
  Sentry.init({
    dsn: dsn,
    tracesSampleRate: 1.0,
  });
}
