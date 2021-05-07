import * as Sentry from '@sentry/node';

let _isInitialized = false;

const init = () => {
  if (_isInitialized) {
    return;
  }

  Sentry.init({
    dsn: process.env.SENTRY_DSN,

    // Set tracesSampleRate to 1.0 to capture 100%
    // of transactions for performance monitoring.
    // We recommend adjusting this value in production
    tracesSampleRate: 1.0,
  });
  _isInitialized = true;
};

export const logWarningInSentry = (message) => {
  if (process.env.NODE_ENV === 'production' && process.env.SENTRY_DSN) {
    init();
    Sentry.captureMessage(message, {
      level: 'info',
    });
  }
};

export const logErrorInSentry = (errorMsg) => {
  init();
  if (process.env.NODE_ENV === 'production' && process.env.SENTRY_DSN) {
    Sentry.captureException(errorMsg);
  }
};

export default logErrorInSentry;
