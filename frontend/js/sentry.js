import * as Sentry from '@sentry/browser';
import { BrowserTracing } from '@sentry/tracing';

var dsn = import.meta.env.VITE_SENTRY_FRONT_DSN;

if (import.meta.env.PROD && Sentry && dsn) {
  Sentry.init({
    dsn: dsn,
    // This enables automatic instrumentation (highly recommended), but is not
    // necessary for purely manual usage
    integrations: [new BrowserTracing()],

    // To set a uniform sample rate
    tracesSampleRate: 0.2,
  });
}
