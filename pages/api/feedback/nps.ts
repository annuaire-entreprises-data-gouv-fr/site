import { NextApiRequest, NextApiResponse } from 'next';
import { logEventInMatomo } from '#utils/analytics/matomo';
import logInMattermost from '#utils/integrations/mattermost';
import logErrorInSentry from '#utils/sentry';

const logAllEvents = async (req: NextApiRequest) => {
  try {
    const today = new Date();
    const NA = 'Non renseigné';
    const visitorType = req.body['radio-set-visitor-type'] || NA;
    const mood = req.body['radio-set-mood'];
    const uuid = req.body['uuid'];
    const origin = req.body['radio-set-visitor-origin'] || NA;

    const mattermostData = {
      username: 'clippy',
      text: `Note : **${mood}/10** \nVisiteur : ${visitorType} \nOrigine : ${origin}`,
    };

    await logInMattermost(mattermostData);
    await logEventInMatomo(
      'feedback:nps',
      NA,
      `mood=${mood}&type=${visitorType}&origin=${origin}&date=${
        today.toISOString().split('T')[0]
      }&uuid=${uuid}`,
      'nps'
    );
  } catch (e: any) {
    logErrorInSentry('Error in form submission', { details: e.toString() });
  }
};

const saveAndRedirect = async (req: NextApiRequest, res: NextApiResponse) => {
  // we choose not to await as we dont want to stall the request if any logEvent fails
  logAllEvents(req);

  res.writeHead(302, {
    Location: '/formulaire/nps/merci',
  });
  res.end();
};

export default saveAndRedirect;
