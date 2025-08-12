import { HttpForbiddenError } from '#clients/exceptions';
import { InternalError } from '#models/exceptions';
import { getHidePersonalDataRequestFCSession } from '#utils/session';
import { randomBytes } from 'crypto';
import * as client from 'openid-client';

let server = process.env.FRANCECONNECT_URL as string;
let clientId = process.env.FRANCECONNECT_CLIENT_ID as string;
let clientSecret = process.env.FRANCECONNECT_CLIENT_SECRET as string;
let redirect_uri = process.env.FRANCECONNECT_REDIRECT_URI as string;
let post_logout_redirect_uri = process.env
  .FRANCECONNECT_POST_LOGOUT_REDIRECT_URI as string;

export const franceConnectAuthorizeUrl = async (req: any) => {
  let config = await client.discovery(new URL(server), clientId, clientSecret);

  const session = req.session;
  session.state = client.randomState();
  session.nonce = client.randomNonce();
  await session.save();

  let parameters: Record<string, string> = {
    redirect_uri,
    acr_values: 'eidas1',
    scope: 'openid ' + franceConnectScope.join(' '),
    state: session.state,
    nonce: session.nonce,
  };

  let redirectTo = client.buildAuthorizationUrl(config, parameters);
  return redirectTo;
};
const franceConnectScope = ['family_name', 'given_name', 'birthdate'] as const;

export type IFranceConnectUserInfo = Partial<
  Record<(typeof franceConnectScope)[number], string | undefined>
> & {
  id_token: string;
  sub: string;
};

export async function franceConnectAuthenticate(req: any) {
  let config = await client.discovery(new URL(server), clientId, clientSecret);

  const session = req.session;
  let tokens = await client.authorizationCodeGrant(config, currentUrl, {
    expectedNonce: session.nonce,
    expectedState: session.state,
    idTokenExpected: true,
  });
  delete req.session.state;
  delete req.session.nonce;
  await req.session.save();

  const { access_token } = tokens;
  let claims = tokens.claims()!;
  const { sub } = claims;

  if (!access_token) {
    throw new HttpForbiddenError('No access token');
  }

  let userInfo = await client.fetchUserInfo(config, access_token, sub);
  return userInfo;
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
