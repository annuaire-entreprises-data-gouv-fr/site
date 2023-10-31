import { NextApiRequest, NextApiResponse } from 'next';
import { logEventInMatomo } from '#utils/analytics/matomo';
import {
  logSuggestionToNotion,
  notionFeedbacksLink,
} from '#utils/integrations/notion';
import logInTchap from '#utils/integrations/tchap';
import logErrorInSentry from '#utils/sentry';

const logAllEvents = async (req: NextApiRequest) => {
  try {
    const today = new Date();
    const NA = 'Non renseigné';
    const visitorType = req.body['radio-set-visitor-type'] || NA;
    const mood = req.body['radio-set-mood'];
    const uuid = req.body['uuid'];
    const origin = req.body['radio-set-visitor-origin'] || NA;
    const text = req.body['textarea'] || null;
    const email = req.body['email'] || NA;

    const commentaire = text
      ? ` \nCommentaire : ${text} \nEmail : ${email} \nLien notion : ${notionFeedbacksLink}`
      : '';

    const tchapText = `Note : ${mood}/10 \nVisiteur : ${visitorType} \nOrigine : ${origin}${commentaire}`;

    // async functions but no need to await them
    logInTchap(tchapText);
    logEventInMatomo(
      'feedback:nps',
      NA,
      `mood=${mood}&type=${visitorType}&origin=${origin}&date=${
        today.toISOString().split('T')[0]
      }&uuid=${uuid}`,
      'nps'
    );
    if (text) {
      // async functions but no need to await them
      logSuggestionToNotion(visitorType, email, text);
    }
  } catch (e: any) {
    logErrorInSentry(e, { errorName: 'Error in form submission' });
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
