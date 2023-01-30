import { Issuer, BaseClient } from 'openid-client';
import { HttpForbiddenError } from '#clients/exceptions';

let _client = undefined as BaseClient | undefined;

const CLIENT_ID = process.env.MONCOMPTEPRO_CLIENT_ID;
const ISSUER_URL = process.env.MONCOMPTEPRO_URL;
const CLIENT_SECRET = process.env.MONCOMPTEPRO_CLIENT_SECRET;
const REDIRECT_URI = process.env.MONCOMPTEPRO_REDIRECT_URI;
const POST_LOGOUT_REDIRECT_URI =
  process.env.MONCOMPTEPRO_POST_LOGOUT_REDIRECT_URI;

if (
  !CLIENT_ID ||
  !ISSUER_URL ||
  !CLIENT_SECRET ||
  !REDIRECT_URI ||
  !POST_LOGOUT_REDIRECT_URI
) {
  throw new Error('MON COMPTE PRO ENV variables are not defined');
}

export const getClient = async () => {
  if (_client) {
    return _client;
  } else {
    const monCompteProIssuer = await Issuer.discover(ISSUER_URL as string);

    _client = new monCompteProIssuer.Client({
      client_id: CLIENT_ID as string,
      client_secret: CLIENT_SECRET as string,
      redirect_uris: [REDIRECT_URI as string],
      post_logout_redirect_uris: [POST_LOGOUT_REDIRECT_URI as string],
    });

    return _client;
  }
};

export const monCompteProAuthorizeUrl = async () => {
  const client = await getClient();
  return client.authorizationUrl({
    scope: 'openid email',
  });
};

export const monCompteProGetToken = async (req: any) => {
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

  const userInfo = await client.userinfo(access_token);
  return userInfo;
};

export const monCompteProLogoutUrl = async () => {
  const client = await getClient();
  return client.endSessionUrl({
    post_logout_redirect_uri: POST_LOGOUT_REDIRECT_URI,
  });
};
