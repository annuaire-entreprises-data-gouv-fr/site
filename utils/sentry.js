import Raven from 'raven';

export const logWarningInSentry = (message) => {
  if (process.env.NODE_ENV === 'production' && process.env.SENTRY_DSN) {
    Raven.config(process.env.SENTRY_DSN).install();
    Raven.captureMessage(message, {
      level: 'info',
    });
  }
};

export const logErrorInSentry = (error) => {
  if (process.env.NODE_ENV === 'production' && process.env.SENTRY_DSN) {
    Raven.config(process.env.SENTRY_DSN).install();
    Raven.captureException(new Error(error));
  }
};

export default logErrorInSentry;
