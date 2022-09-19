import * as Sentry from '@sentry/nextjs';
import { NextApiRequest, NextApiResponse } from 'next';

const getTransactionNameFromUrl = (url: string) => {
  try {
    return url.replace(/\d{9}|\d{14}/g, ':slug');
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
