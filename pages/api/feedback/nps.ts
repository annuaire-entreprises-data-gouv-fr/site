import { NextApiRequest, NextApiResponse } from 'next';
import { Exception } from '#models/exceptions';
import { logInGrist } from '#utils/integrations/grist';
import logInTchap from '#utils/integrations/tchap';
import logErrorInSentry from '#utils/sentry';

/**
 * Log feedback in relevant platform
 *
 * NB : uses many async functions but intentionnally DO NOT await them
 * @param req
 */
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

    // grist
    logInGrist('nps-feedbacks', [
      {
        visitorType,
        mood,
        text,
        email,
        origin,
        date: today.toISOString().split('T')[0],
        uuid,
      },
    ]);

    // tchap : only if text
    if (text) {
      const commentaire = text
        ? ` \nCommentaire : ${text} \nEmail : ${email}`
        : '';
      const tchapText = `Note : ${mood}/10 \nVisiteur : ${visitorType} \nOrigine : ${origin}${commentaire}`;
      logInTchap(tchapText);
    }
  } catch (e: any) {
    logErrorInSentry(
      new Exception({
        name: 'NPSFormSubmissionException',
        cause: e,
      })
    );
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
