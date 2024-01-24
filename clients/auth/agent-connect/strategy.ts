import { BaseClient, Issuer, generators } from 'openid-client';
import { HttpForbiddenError } from '#clients/exceptions';
import { IReqWithSession } from '#utils/session/with-session';

let _client = undefined as BaseClient | undefined;

const CLIENT_ID = process.env.AGENTCONNECT_CLIENT_ID;
const CLIENT_SECRET = process.env.AGENTCONNECT_CLIENT_SECRET;
const ISSUER_URL = process.env.AGENTCONNECT_URL_DISCOVER;
const REDIRECT_URI = process.env.AGENTCONNECT_REDIRECT_URI;
const POST_LOGOUT_REDIRECT_URI =
  process.env.AGENTCONNECT_POST_LOGOUT_REDIRECT_URI;

const SCOPES = 'openid given_name usual_name email siret';

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
      redirect_uris: [REDIRECT_URI],
      post_logout_redirect_uris: [POST_LOGOUT_REDIRECT_URI as string],
      userinfo_signed_response_alg: 'RS256',
    });

    return _client;
  }
};

export const agentConnectAuthorizeUrl = async (req: IReqWithSession) => {
  const client = await getClient();

  const nonce = generators.nonce();
  const state = generators.state();

  req.session.state = state;
  req.session.nonce = nonce;
  await req.session.save();

  return client.authorizationUrl({
    scope: SCOPES,
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

export const agentConnectAuthenticate = async (req: IReqWithSession) => {
  const client = await getClient();

  const params = client.callbackParams(req);

  const tokenSet = await client.grant({
    grant_type: 'authorization_code',
    code: params.code,
    redirect_uri: REDIRECT_URI,
    scope: SCOPES,
  });

  const accessToken = tokenSet.access_token;
  if (!accessToken) {
    throw new HttpForbiddenError('No access token');
  }

  const userInfo = (await client.userinfo(tokenSet)) as IAgentConnectUserInfo;
  req.session.idToken = tokenSet.id_token;
  await req.session.save();

  return userInfo;
};

export const agentConnectLogoutUrl = async (req: IReqWithSession) => {
  const client = await getClient();
  return client.endSessionUrl({
    id_token_hint: req.session.idToken,
    post_logout_redirect_uri: POST_LOGOUT_REDIRECT_URI,
  });
};
