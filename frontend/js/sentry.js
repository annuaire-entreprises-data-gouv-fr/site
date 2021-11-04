import * as Sentry from '@sentry/browser';
var dsn = import.meta.env.SENTRY_FRONT_DSN;

if (import.meta.env.NODE_ENV === 'production' && Sentry && dsn) {
  Sentry.init({
    dsn: dsn,
    tracesSampleRate: 1.0,
  });
}
