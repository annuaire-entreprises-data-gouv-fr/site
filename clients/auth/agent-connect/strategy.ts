import { HttpForbiddenError } from '#clients/exceptions';
import { BaseClient, Issuer, generators } from 'openid-client';

let _client = undefined as BaseClient | undefined;

const CLIENT_ID = process.env.AGENTCONNECT_CLIENT_ID;
const CLIENT_SECRET = process.env.AGENTCONNECT_CLIENT_SECRET;
const ISSUER_URL = process.env.AGENTCONNECT_URL_DISCOVER;
const REDIRECT_URI = process.env.AGENTCONNECT_REDIRECT_URI;
const POST_LOGOUT_REDIRECT_URI =
  process.env.AGENTCONNECT_POST_LOGOUT_REDIRECT_URI;

if (
  !CLIENT_ID ||
  !ISSUER_URL ||
  !CLIENT_SECRET ||
  !REDIRECT_URI ||
  !POST_LOGOUT_REDIRECT_URI
) {
  throw new Error('AGENT CONNECT ENV variables are not defined');
}

export const getClient = async () => {
  if (_client) {
    return _client;
  } else {
    const agentConnectIssuer = await Issuer.discover(ISSUER_URL as string);

    _client = new agentConnectIssuer.Client({
      client_id: CLIENT_ID as string,
      client_secret: CLIENT_SECRET as string,
      redirect_uri: REDIRECT_URI,
      post_logout_redirect_uris: [POST_LOGOUT_REDIRECT_URI as string],
    });

    return _client;
  }
};

export const agentConnectAuthorizeUrl = async () => {
  const client = await getClient();

  const nonce = generators.nonce();
  const state = generators.state();

  return client.authorizationUrl({
    scope:
      'openid uid given_name usual_name email siren siret organizational_unit belonging_population phone chorusdt idp_id idp_acr',
    acr_values: 'eidas1',
    response_type: 'code',
    nonce,
    state,
  });
};

export type IAgentConnectUserInfo = {
  sub: string;
  email: string;
  email_verified: boolean;
  family_name: string | null;
  given_name: string | null;
  phone_number: string | null;
  job: string | null;
  siret: string;
  is_external: boolean;
  label: string | null;
  is_collectivite_territoriale: boolean;
  is_service_public: boolean;
};

export const agentConnectAuthenticate = async (req: any) => {
  const client = await getClient();

  const params = client.callbackParams(req);
  const tokenSet = await client.callback(
    // reuse redirect_uri
    REDIRECT_URI,
    params
  );

  const { access_token } = tokenSet;

  if (!access_token) {
    throw new HttpForbiddenError('No access token');
  }

  const userInfo = (await client.userinfo(
    access_token
  )) as IAgentConnectUserInfo;
  return userInfo;
};

export const agentConnectLogoutUrl = async () => {
  const client = await getClient();
  return client.endSessionUrl({
    post_logout_redirect_uri: POST_LOGOUT_REDIRECT_URI,
  });
};
