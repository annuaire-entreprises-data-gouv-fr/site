import { Exception } from '#models/exceptions';
import { logInGrist } from '#utils/integrations/grist';
import logInTchap from '#utils/integrations/tchap';
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
      let commentaire = text ? `\nCommentaire : ${text}` : '';

      commentaire += hasEmail
        ? `\nEmail : ${email} (<a href="mailto:${email}?subject=${encodeURIComponent(
            `Réponse à votre message`
          )}&body=${encodeURIComponent(
            `Bonjour,\n Merci pour votre message : “ ${text} ” \nBonne journée,`
          )}>répondre</a>)`
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

export async function POST(req: Request) {
  // we choose not to await as we dont want to stall the request if any logEvent fails
  logAllEvents(req);

  redirect('/formulaire/merci');
}
