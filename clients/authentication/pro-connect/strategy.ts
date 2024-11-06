// Documentation ProConnect
// https://github.com/numerique-gouv/proconnect-documentation/blob/main/doc_fs/implementation_technique.md

import { HttpForbiddenError } from '#clients/exceptions';
import { IReqWithSession } from '#utils/session/with-session';
import { BaseClient, Issuer, generators } from 'openid-client';

let _client = undefined as BaseClient | undefined;

// LEGACY
// Pro Connect was called Agent Connect in the past
const CLIENT_ID = process.env.AGENTCONNECT_CLIENT_ID;
const CLIENT_SECRET = process.env.AGENTCONNECT_CLIENT_SECRET;
const ISSUER_URL = process.env.AGENTCONNECT_URL_DISCOVER;
const REDIRECT_URI = process.env.AGENTCONNECT_REDIRECT_URI;
const POST_LOGOUT_REDIRECT_URI =
  process.env.AGENTCONNECT_POST_LOGOUT_REDIRECT_URI;

const SCOPES = 'openid given_name usual_name email siret idp_id';

export const getClient = async () => {
  if (_client) {
    return _client;
  } else {
    if (
      !CLIENT_ID ||
      !ISSUER_URL ||
      !CLIENT_SECRET ||
      !REDIRECT_URI ||
      !POST_LOGOUT_REDIRECT_URI
    ) {
      throw new Error('PRO CONNECT ENV variables are not defined');
    }
    const proConnectIssuer = await Issuer.discover(ISSUER_URL);

    _client = new proConnectIssuer.Client({
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      redirect_uris: [REDIRECT_URI],
      post_logout_redirect_uris: [POST_LOGOUT_REDIRECT_URI],
      id_token_signed_response_alg: 'RS256',
      userinfo_signed_response_alg: 'RS256',
    });

    return _client;
  }
};

export const proConnectAuthorizeUrl = async (req: IReqWithSession) => {
  const client = await getClient();

  const nonce = generators.nonce();
  const state = generators.state();

  req.session.state = state;
  req.session.nonce = nonce;
  await req.session.save();

  return client.authorizationUrl({
    scope: SCOPES,
    acr_values: 'eidas1',
    nonce,
    state,
    claims: {
      id_token: {
        amr: {
          essential: true,
        },
      },
    },
  });
};

export type IProConnectUserInfo = {
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
  idp_id: string;
};

export const proConnectAuthenticate = async (req: IReqWithSession) => {
  const client = await getClient();

  const params = client.callbackParams(req.nextUrl.toString());

  const tokenSet = await client.callback(REDIRECT_URI, params, {
    nonce: req.session.nonce,
    state: req.session.state,
  });

  const accessToken = tokenSet.access_token;
  if (!accessToken) {
    throw new HttpForbiddenError('No access token');
  }

  const userInfo = (await client.userinfo(tokenSet)) as IProConnectUserInfo;
  req.session.nonce = undefined;
  req.session.state = undefined;
  req.session.idToken = tokenSet.id_token;
  await req.session.save();

  return userInfo;
};

export const proConnectLogoutUrl = async (req: IReqWithSession) => {
  const client = await getClient();
  return client.endSessionUrl({
    id_token_hint: req.session.idToken,
    post_logout_redirect_uri: POST_LOGOUT_REDIRECT_URI,
  });
};
