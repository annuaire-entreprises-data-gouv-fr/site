import routes from '#clients/routes';
import { Exception } from '#models/exceptions';
import httpClient from '#utils/network';

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
const crispAuthHeaders = {
  'X-Crisp-Tier': 'plugin',
  Authorization:
    'Basic ' +
    btoa(process.env.CRISP_TOKEN_ID + ':' + process.env.CRISP_TOKEN_KEY),
};

const rootUrl = routes.tooling.crisp + websiteID;

export async function sendMessageToCrisp(
  author: {
    name?: string;
    email: string;
  },
  message: string,
  tags: Array<string> = []
): Promise<void> {
  try {
    const response = await httpClient<{ data: { session_id: string } }>({
      method: 'POST',
      url: rootUrl + '/conversation',
      headers: crispAuthHeaders,
      data: {},
    });
    const sessionID = response.data.session_id;
    const metas = {
      nickname: author.name,
      email: author.email,
      segments: tags,
    };

    await httpClient({
      method: 'PATCH',
      headers: crispAuthHeaders,
      url: rootUrl + '/conversation/' + sessionID + '/meta',
      data: metas,
    });

    await httpClient({
      method: 'POST',
      headers: crispAuthHeaders,
      url: rootUrl + '/conversation/' + sessionID + '/message',
      data: {
        type: 'text',
        content: message,
        from: 'user',
        origin: 'chat',
      },
    });
  } catch (error) {
    throw new Exception({
      name: 'CrispClientError',
      cause: error,
    });
  }
}
