import * as Sentry from '@sentry/browser';
var dsn = import.meta.env.VITE_SENTRY_FRONT_DSN;

console.log(import.meta.env.PROD, !!Sentry, !!dsn);

if (import.meta.env.PROD && Sentry && dsn) {
  console.log('sentry init');
  Sentry.init({
    dsn: dsn,
    tracesSampleRate: 1.0,
  });
}
