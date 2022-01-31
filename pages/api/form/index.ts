import { NextApiRequest, NextApiResponse } from 'next';

import nextConnect from 'next-connect';
import { logEventInMatomo } from '../../../utils/analytics/matomo';
import httpClient from '../../../utils/network';
import logErrorInSentry from '../../../utils/sentry';

const logAllEvents = async (req: NextApiRequest) => {
  try {
    const today = new Date();

    const NA = 'Non renseigné';

    await logEventInMatomo(
      'feedback:nps',
      req.body['textarea'] || '',
      `mood=${req.body['radio-set-mood']}&type=${
        req.body['radio-set-visitor-type'] || NA
      }&origin=${req.body['radio-set-visitor-origin'] || NA}&date=${
        today.toISOString().split('T')[0]
      }`,
      'nps'
    );

    const data = {
      username: 'clippy',
      text: `Note : **${req.body['radio-set-mood']}/5** \nVisiteur : ${
        req.body['radio-set-visitor-type'] || NA
      } \nOrigine : ${
        req.body['radio-set-visitor-origin'] || NA
      } \nCommentaire : *${req.body['textarea'] || NA}*`,
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

export default nextConnect<NextApiRequest, NextApiResponse>().post(
  async (req, res) => {
    // we choose not to await as we dont want to stall the request if any logEvent fails
    logAllEvents(req);
    return res.redirect('/formulaire/merci');
  }
);
