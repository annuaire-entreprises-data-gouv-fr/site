import { NextApiRequest, NextApiResponse } from 'next';
import { logSuggestionToNotion } from '#utils/integrations/notion';
import logErrorInSentry from '#utils/sentry';

const logAllEvents = async (req: NextApiRequest) => {
  try {
    const NA = 'Non renseigné';
    const visitorType = req.body['radio-set-visitor-type'] || NA;
    const suggestion = req.body['textarea'] || NA;
    const email = req.body['email'] || NA;

    // async functions but no need to await them
    logSuggestionToNotion(visitorType, email, suggestion);
  } catch (e: any) {
    logErrorInSentry(e, {
      errorName: 'Error in form submission',
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
