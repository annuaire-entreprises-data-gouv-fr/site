import * as Sentry from '@sentry/nextjs';
import { NextApiRequest, NextApiResponse } from 'next';

const getTransactionNameFromUrl = (url: string) => {
  try {
    if (url.indexOf('/entreprise') === 0) {
      return '/entreprise/:slug';
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
  return (req: NextApiRequest, res: NextApiResponse) => {
    const url = req?.url || '/unknown';
    const transaction = createAPM(url, 'withAPM');
    try {
      return callback(req, res);
    } finally {
      transaction.finish();
    }
  };
};
