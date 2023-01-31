import { NextApiRequest, NextApiResponse } from 'next';
import env from '#env';
import { logEventInMatomo } from '#utils/analytics/matomo';
import httpClient from '#utils/network';
import logErrorInSentry from '#utils/sentry';

const logAllEvents = async (req: NextApiRequest) => {
  try {
    const today = new Date();

    const NA = 'Non renseigné';

    await logEventInMatomo(
      'feedback:nps',
      req.body['textarea'] || NA,
      `mood=${req.body['radio-set-mood']}&type=${
        req.body['radio-set-visitor-type'] || NA
      }&origin=${req.body['radio-set-visitor-origin'] || NA}&date=${
        today.toISOString().split('T')[0]
      }&uuid=${req.body['uuid']}`,
      'nps'
    );

    if (env.MATTERMOST_HOOK) {
      const data = {
        username: 'clippy',
        text: `Note : **${req.body['radio-set-mood']}/10** \nVisiteur : ${
          req.body['radio-set-visitor-type'] || NA
        } \nOrigine : ${
          req.body['radio-set-visitor-origin'] || NA
        } \nCommentaire : *${req.body['textarea'] || NA}*`,
      };

      await httpClient({
        url: env.MATTERMOST_HOOK,
        method: 'POST',
        data,
      });
    }
  } catch (e: any) {
    logErrorInSentry('Error in form submission', { details: e.toString() });
  }
};

const saveAndRedirect = async (req: NextApiRequest, res: NextApiResponse) => {
  // we choose not to await as we dont want to stall the request if any logEvent fails
  logAllEvents(req);
  res.writeHead(302, {
    Location: '/formulaire/merci',
  });
  res.end();
};

export default saveAndRedirect;
