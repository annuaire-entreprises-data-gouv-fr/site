import { logInGrist } from '#clients/external-tooling/grist';
import logInTchap from '#clients/external-tooling/tchap';
import { Exception } from '#models/exceptions';
import logErrorInSentry from '#utils/sentry';
import { redirect } from 'next/navigation';

/**
 * Log feedback in relevant platform
 *
 * NB : uses many async functions but intentionnally DO NOT await them
 * @param req
 */
const logAllEvents = async (req: Request) => {
  try {
    const formData = await req.formData();
    const today = new Date();
    const NA = 'Non renseigné';
    const visitorType = formData.get('radio-set-visitor-type') || NA;
    const mood = formData.get('radio-set-mood');
    const uuid = formData.get('uuid');
    const origin = formData.get('radio-set-visitor-origin') || NA;
    const text = formData.get('textarea') || null;
    const hasEmail = !!formData.get('email');
    const email = formData.get('email') || NA;

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
      const tchapText = `Note : ${mood}/10 \nVisiteur : ${visitorType} \nOrigine : ${origin}\nCommentaire : ${text}${
        hasEmail ? `\nEmail : ${email}` : ''
      }`;
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

export async function POST(req: Request) {
  // we choose not to await as we dont want to stall the request if any logEvent fails
  logAllEvents(req);

  redirect('/formulaire/merci');
}
