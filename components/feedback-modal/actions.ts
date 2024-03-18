'use server';

import { Exception } from '#models/exceptions';
import { sendMessageToCrisp } from '#utils/integrations/crisp';
import { logInGrist, readFromGrist } from '#utils/integrations/grist';
import logErrorInSentry, { logWarningInSentry } from '#utils/sentry';
import { IAgentContactInfo } from '#utils/session';
import { FeedbackType } from './type';

export async function sendFeedback(
  agentContactInfo: IAgentContactInfo,
  form: FormData
) {
  const type = form.get('type') as FeedbackType;
  const message = form.get('message');

  if (typeof message !== 'string') {
    throw new Exception({
      name: 'AgentFeedbackFormError',
      message: 'Message is not a string',
    });
  }
  try {
    await sendMessageToCrisp(agentContactInfo, message, [type, 'agent']);
  } catch (error) {
    logErrorInSentry(
      new Exception({
        name: 'AgentFeedbackFormError',
        cause: error,
      })
    );
    return false;
  }
  return true;
}

/**
 * Register an agent to the beta testeur list
 * @param agentContactInfo
 * @returns null if agent is already registered, true if agent is successfully registered, false if an error occured
 *
 */
export async function registerToBeta(
  agentContactInfo: IAgentContactInfo
): Promise<boolean | null> {
  try {
    const betaTesteurs = await readFromGrist('agents-beta-testeurs');
    const isRegisteredToBeta = !!betaTesteurs.find(
      (r) => r.email === agentContactInfo.email
    );
    if (isRegisteredToBeta) {
      return null;
    }
    await logInGrist('agents-beta-testeurs', [
      {
        email: agentContactInfo.email,
        date_enregistrement: new Date().toISOString().slice(0, 10),
      },
    ]);
    return true;
  } catch (error) {
    logWarningInSentry(
      new Exception({
        name: 'AgentFeedbackFormError',
        message: 'Error while registering agent to beta testeur list',
        cause: error,
      })
    );
    return false;
  }
}
