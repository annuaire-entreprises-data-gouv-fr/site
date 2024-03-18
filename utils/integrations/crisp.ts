import Crisp from 'crisp-api';
import { Exception } from '#models/exceptions';

const CrispClient = new Crisp();

if (
  !process.env.CRISP_TOKEN_ID ||
  !process.env.CRISP_TOKEN_KEY ||
  !process.env.CRISP_WEBSITE_ID
) {
  throw new Error(
    'CRISP_TOKEN_ID, CRISP_TOKEN_KEY and CRISP_WEBSITE_ID environment variables must be set'
  );
}

const websiteID = process.env.CRISP_WEBSITE_ID;
CrispClient.authenticateTier(
  'plugin',
  process.env.CRISP_TOKEN_ID,
  process.env.CRISP_TOKEN_KEY
);

export async function sendMessageToCrisp(
  author: {
    name?: string;
    email: string;
  },
  message: string,
  tags: Array<string> = []
): Promise<void> {
  try {
    const response = await CrispClient.website.createNewConversation(websiteID);
    const sessionID = response.session_id;

    const metas = {
      nickname: author.name,
      email: author.email,
      segments: tags,
    };

    await CrispClient.website.updateConversationMetas(
      websiteID,
      sessionID,
      metas
    );

    await CrispClient.website.sendMessageInConversation(websiteID, sessionID, {
      type: 'text',
      content: message,
      from: 'user',
      origin: 'chat',
    });
  } catch (error) {
    console.error(error);

    throw new Exception({
      name: 'CrispClientError',
      cause: error,
    });
  }
}
