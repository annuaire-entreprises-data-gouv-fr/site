import * as Sentry from '@sentry/browser';
import { BrowserTracing } from '@sentry/tracing';

var dsn = import.meta.env.VITE_SENTRY_FRONT_DSN;

if (import.meta.env.PROD && Sentry && dsn) {
  Sentry.init({
    dsn: dsn,
    // This enables automatic instrumentation (highly recommended), but is not
    // necessary for purely manual usage
    integrations: [new BrowserTracing()],

    tracesSampler: (samplingContext) => {
      const path = samplingContext?.location?.pathname || '';

      return (
        path.indexOf('/entreprise') > -1 ||
        path.indexOf('/rechercher') > -1 ||
        path.indexOf('/justificatif-immatriculation-pdf') > -1
      );
    },
  });
}
