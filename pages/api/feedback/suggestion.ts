import { NextApiRequest, NextApiResponse } from 'next';
import logInMattermost from '#utils/integrations/mattermost';
import {
  logSuggestionToNotion,
  notionFeedbacksLink,
} from '#utils/integrations/notion';
import logInTchap from '#utils/integrations/tchap';
import logErrorInSentry from '#utils/sentry';

const logAllEvents = async (req: NextApiRequest) => {
  try {
    const NA = 'Non renseigné';
    const visitorType = req.body['radio-set-visitor-type'] || NA;
    const suggestion = req.body['textarea'] || NA;
    const email = req.body['email'] || NA;

    const mattermostData = {
      username: 'clippy',
      text: `**Nouvelle suggestion** \nVisiteur : ${visitorType} \nSuggestion : ${suggestion} \nLien notion : [👉 ici](${notionFeedbacksLink})`,
    };

    // async functions but no need to await them
    logInMattermost(mattermostData);
    logInTchap({ text: mattermostData.text });

    logSuggestionToNotion(visitorType, email, suggestion);
  } catch (e: any) {
    logErrorInSentry('Error in form submission', {
      details: e.toString(),
    });
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
