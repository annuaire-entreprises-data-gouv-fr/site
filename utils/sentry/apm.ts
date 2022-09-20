import * as Sentry from '@sentry/nextjs';
import { NextApiRequest, NextApiResponse } from 'next';

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

export const createAPM = (url: string, operator: string) =>
  Sentry.startTransaction({
    op: operator,
    name: getTransactionNameFromUrl(url),
  });

export const withAPM = (
  callback: (req: NextApiRequest, res: NextApiResponse) => Promise<void>
) => {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    const url = req?.url || '/unknown';
    const transaction = createAPM(url, 'withAPM');
    try {
      await callback(req, res);
    } finally {
      transaction.finish();
    }
  };
};
