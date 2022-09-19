import * as Sentry from '@sentry/browser';
import { BrowserTracing } from '@sentry/tracing';

var dsn = import.meta.env.VITE_SENTRY_FRONT_DSN;

if (import.meta.env.PROD && Sentry && dsn) {
  Sentry.init({
    dsn: dsn,
    // This enables automatic instrumentation (highly recommended), but is not
    // necessary for purely manual usage
    integrations: [
      new BrowserTracing({
        beforeNavigate: (context) => {
          let url = location.pathname || '/unknown';
          if (url.indexOf('/entreprise') > -1) {
            url = '/entreprise/:slug';
          }
          if (url.indexOf('/rechercher') > -1) {
            url = '/rechercher/:slug';
          }
          if (url.indexOf('/justificatif-immatriculation-pdf') > -1) {
            url = '/justificatif-immatriculation-pdf/:slug';
          }

          return {
            ...context,
            name: url,
          };
        },
      }),
    ],

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
