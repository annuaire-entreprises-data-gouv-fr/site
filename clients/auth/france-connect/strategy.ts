import { randomBytes } from 'crypto';
import { BaseClient, Issuer, generators } from 'openid-client';
import { HttpForbiddenError } from '#clients/exceptions';
import { InternalError } from '#models/exceptions';
import { getHidePersonalDataRequestFCSession } from '#utils/session';

let _client = undefined as BaseClient | undefined;

const CLIENT_ID = process.env.FRANCECONNECT_CLIENT_ID;
const ISSUER_URL = process.env.FRANCECONNECT_URL;
const CLIENT_SECRET = process.env.FRANCECONNECT_CLIENT_SECRET;
const REDIRECT_URI = process.env.FRANCECONNECT_REDIRECT_URI;
const POST_LOGOUT_REDIRECT_URI =
  process.env.FRANCECONNECT_POST_LOGOUT_REDIRECT_URI;
if (
  !CLIENT_ID ||
  !ISSUER_URL ||
  !CLIENT_SECRET ||
  !REDIRECT_URI ||
  !POST_LOGOUT_REDIRECT_URI
) {
  throw new InternalError({
    message: 'FRANCECONNECT ENV variables are not defined',
  });
}

export const getClient = async () => {
  if (_client) {
    return _client;
  } else {
    const FranceConnectIssuer = new Issuer({
      issuer: ISSUER_URL,
      authorization_endpoint: `${ISSUER_URL}/api/v1/authorize`,
      token_endpoint: `${ISSUER_URL}/api/v1/token`,
      userinfo_endpoint: `${ISSUER_URL}/api/v1/userinfo`,
      end_session_endpoint: `${ISSUER_URL}/api/v1/logout`,
    });

    _client = new FranceConnectIssuer.Client({
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      redirect_uris: [REDIRECT_URI],
      post_logout_redirect_uris: [POST_LOGOUT_REDIRECT_URI],
      id_token_signed_response_alg: 'HS256',
      response_types: ['code'],
    });

    return _client;
  }
};

export const FranceConnectAuthorizeUrl = async (req: any) => {
  const client = await getClient();
  const session = await req.session;
  session.FC_CONNECT_CHECK = {
    state: generators.state(),
    nonce: generators.nonce(),
  };
  await session.save();
  return client.authorizationUrl({
    scope: 'openid ' + franceConnectScope.join(' '),
    acr_values: 'eidas1',
    ...session.FC_CONNECT_CHECK,
  });
};
const franceConnectScope = ['family_name', 'given_name', 'birthdate'] as const;

export type IFranceConnectUserInfo = Partial<
  Record<(typeof franceConnectScope)[number], string | undefined>
> & {
  id_token: string;
  sub: string;
};

export async function franceConnectAuthenticate(
  req: any
): Promise<IFranceConnectUserInfo> {
  const client = await getClient();
  const params = client.callbackParams(req);
  const tokenSet = await client.callback(
    // reuse redirect_uri
    REDIRECT_URI,
    params,
    req.session.FC_CONNECT_CHECK,
    {
      exchangeBody: {
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
      },
    }
  );
  delete req.session.FC_CONNECT_CHECK;
  await req.session.save();
  const { access_token, id_token } = tokenSet;
  if (!access_token || !id_token) {
    throw new HttpForbiddenError('No access token');
  }

  const userInfo = await client.userinfo(access_token);
  return { ...userInfo, id_token, sub: userInfo.sub };
}

export const franceConnectLogoutUrl = async (req: any) => {
  const franceConnect = getHidePersonalDataRequestFCSession(req.session);
  const id_token_hint = franceConnect?.tokenId;
  if (!id_token_hint) {
    throw new InternalError({ message: 'No token id' });
  }
  const client = await getClient();

  const state = `state${randomBytes(32).toString('hex')}`;

  delete req.session.franceConnect;
  await req.session.save();
  return client.endSessionUrl({
    post_logout_redirect_uri: POST_LOGOUT_REDIRECT_URI,
    client_id: CLIENT_ID,
    id_token_hint,
    state,
  });
};
