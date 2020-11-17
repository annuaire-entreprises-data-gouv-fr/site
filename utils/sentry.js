import Raven from 'raven';

export const logMessageInSentry = (message) => {
  if (process.env.NODE_ENV === 'production' && process.env.SENTRY_DSN) {
    Raven.config(process.env.SENTRY_DSN).install();
    Raven.captureMessage(message);
  }
};

export const logErrorInSentry = (error) => {
  if (process.env.NODE_ENV === 'production' && process.env.SENTRY_DSN) {
    Raven.config(process.env.SENTRY_DSN).install();
    Raven.captureException(new Error(error));
  }
};

export default logErrorInSentry;
