import { NextApiRequest, NextApiResponse } from 'next';

import nextConnect from 'next-connect';
import { logEventInMatomo } from '../../../utils/analytics/matomo';
import httpClient from '../../../utils/network';
import logErrorInSentry from '../../../utils/sentry';

const logSearchNps = async (req: NextApiRequest) => {
  try {
    const today = new Date();

    const hasFound = req.query.value === '1';

    await logEventInMatomo(
      'feedback:search-nps',
      req.body['value'],
      `value=${req.body['value']}&date=${today.toISOString().split('T')[0]}`,
      'nps'
    );

    const data = {
      username: 'clippy',
      text: `Feedback : ${
        hasFound ? '1 recherche réussie 🤩 !' : '1 recherche infructueuse 😭 !'
      }`,
    };

    await httpClient({
      url: process.env.MATTERMOST_HOOK,
      method: 'POST',
      data,
    });
  } catch (e: any) {
    logErrorInSentry('Error in form submission', { details: e.toString() });
  }
};

export default nextConnect<NextApiRequest, NextApiResponse>().get(
  async (req, res) => {
    // we choose not to await as we dont want to stall the request if any logEvent fails
    logSearchNps(req);
    res.status(200).end();
  }
);
