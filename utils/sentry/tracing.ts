import { Transaction } from '@sentry/browser';
import * as Sentry from '@sentry/nextjs';
import { NextApiHandler, NextApiRequest, NextApiResponse } from 'next';
import { Exception } from '#models/exceptions';
import { isNextJSSentryActivated, logWarningInSentry } from '.';

const getTransactionNameFromUrl = (url: string) => {
  try {
    if (url.indexOf('/entreprise/') === 0) {
      return '/entreprise/:slug';
    }
    if (url.indexOf('/rechercher/carte') > -1) {
      return '/rechercher/carte';
    } else if (url.indexOf('/rechercher') > -1) {
      return '/rechercher';
    }
    return url.replace('?redirected=1', '').replace(/\d{14}|\d{9}/g, ':slug');
  } catch {
    return url;
  }
};

export const createAPM = (url: string, operator: string) => {
  if (!isNextJSSentryActivated) {
    return;
  }
  return Sentry.startTransaction({
    op: operator,
    name: getTransactionNameFromUrl(url),
  });
};

export const closeAPM = (transaction: Transaction | undefined) => {
  if (transaction) {
    transaction.finish();
  } else if (isNextJSSentryActivated) {
    logWarningInSentry(
      new Exception({
        name: 'SentryLoggingException',
        message: 'APM transaction is not defined',
      })
    );
  }
  // else do nothing as Sentry is not initialized
};

export const withAPM = (handler: NextApiHandler) => {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    const url = req?.url || '/unknown';
    const transaction = createAPM(url, 'withAPM');
    try {
      await handler(req, res);
    } finally {
      if (transaction) {
        closeAPM(transaction);
      }
    }
  };
};
