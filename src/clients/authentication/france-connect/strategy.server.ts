import { randomBytes } from "node:crypto";
import { createServerOnlyFn } from "@tanstack/react-start";
import { getRequestUrl } from "@tanstack/react-start/server";
import {
  authorizationCodeGrant,
  buildAuthorizationUrl,
  buildEndSessionUrl,
  ClientSecretPost,
  type Configuration,
  calculatePKCECodeChallenge,
  discovery,
  fetchUserInfo,
  randomNonce,
  randomPKCECodeVerifier,
  randomState,
} from "openid-client";
import { HttpForbiddenError } from "#/clients/exceptions";
import { InternalError } from "#/models/exceptions";
import {
  getCurrentSession,
  getHidePersonalDataRequestFCSession,
} from "#/utils/session/index.server";

let _client = undefined as Configuration | undefined;

const getConfig = () => ({
  CLIENT_ID: process.env.FRANCE_CONNECT_CLIENT_ID,
  URL: process.env.FRANCE_CONNECT_URL,
  CLIENT_SECRET: process.env.FRANCE_CONNECT_CLIENT_SECRET,
  REDIRECT_URI: process.env.FRANCE_CONNECT_REDIRECT_URI,
  POST_LOGOUT_REDIRECT_URI: process.env.FRANCE_CONNECT_POST_LOGOUT_REDIRECT_URI,
});

export const getClient = createServerOnlyFn(async () => {
  if (_client) {
    return _client;
  }
  const {
    CLIENT_ID,
    URL,
    CLIENT_SECRET,
    REDIRECT_URI,
    POST_LOGOUT_REDIRECT_URI,
  } = getConfig();
  if (
    !CLIENT_ID ||
    !URL ||
    !CLIENT_SECRET ||
    !REDIRECT_URI ||
    !POST_LOGOUT_REDIRECT_URI
  ) {
    throw new InternalError({
      message: "FRANCE CONNECT ENV variables are not defined",
    });
  }
  _client = await discovery(
    new globalThis.URL(`${URL}/api/v2/.well-known/openid-configuration`),
    CLIENT_ID,
    {
      client_secret: CLIENT_SECRET,
      redirect_uris: [REDIRECT_URI],
      post_logout_redirect_uris: [POST_LOGOUT_REDIRECT_URI],
      id_token_signed_response_alg: "RS256",
      userinfo_signed_response_alg: "RS256",
      response_types: ["code"],
    },
    ClientSecretPost(CLIENT_SECRET)
  );

  return _client;
});

export const franceConnectAuthorizeUrl = createServerOnlyFn(async () => {
  const client = await getClient();
  const session = await getCurrentSession();
  const codeVerifier = randomPKCECodeVerifier();
  const codeChallenge = await calculatePKCECodeChallenge(codeVerifier);
  const FC_CONNECT_CHECK = {
    codeVerifier,
    state: randomState(),
    nonce: randomNonce(),
  };
  await session.update({ FC_CONNECT_CHECK });

  const { REDIRECT_URI } = getConfig();
  if (!REDIRECT_URI) {
    throw new InternalError({
      message: "FRANCE CONNECT ENV variables are not defined",
    });
  }
  return buildAuthorizationUrl(client, {
    redirect_uri: REDIRECT_URI,
    scope: "openid " + franceConnectScope.join(" "),
    acr_values: "eidas1",
    code_challenge: codeChallenge,
    code_challenge_method: "S256",
    state: FC_CONNECT_CHECK.state,
    nonce: FC_CONNECT_CHECK.nonce,
  }).href;
});
const franceConnectScope = ["family_name", "given_name", "birthdate"] as const;

export type IFranceConnectUserInfo = Partial<
  Record<(typeof franceConnectScope)[number], string | undefined>
> & {
  id_token: string;
  sub: string;
};

export const franceConnectAuthenticate = createServerOnlyFn(
  async (): Promise<IFranceConnectUserInfo> => {
    const client = await getClient();
    const session = await getCurrentSession();
    const url = getRequestUrl();
    const tokenSet = await authorizationCodeGrant(client, url, {
      pkceCodeVerifier: session.data.FC_CONNECT_CHECK?.codeVerifier,
      expectedNonce: session.data.FC_CONNECT_CHECK?.nonce,
      expectedState: session.data.FC_CONNECT_CHECK?.state,
      idTokenExpected: true,
    });
    await session.update({ FC_CONNECT_CHECK: undefined });

    const { access_token, id_token } = tokenSet;
    if (!access_token || !id_token) {
      throw new HttpForbiddenError("No access token");
    }

    const claims = tokenSet.claims();
    if (!claims?.sub) {
      throw new HttpForbiddenError("No subject in id token");
    }
    const userInfo = await fetchUserInfo(client, access_token, claims.sub);
    return { ...userInfo, id_token, sub: claims.sub };
  }
);

export const franceConnectLogoutUrl = createServerOnlyFn(async () => {
  const session = await getCurrentSession();
  const franceConnect = getHidePersonalDataRequestFCSession(session.data);
  const id_token_hint = franceConnect?.tokenId;
  if (!id_token_hint) {
    throw new InternalError({ message: "No token id" });
  }
  const client = await getClient();

  const state = `state${randomBytes(32).toString("hex")}`;

  await session.update({ franceConnectHidePersonalDataSession: undefined });

  const { POST_LOGOUT_REDIRECT_URI, CLIENT_ID } = getConfig();
  if (!(POST_LOGOUT_REDIRECT_URI && CLIENT_ID)) {
    throw new InternalError({
      message: "FRANCE CONNECT ENV variables are not defined",
    });
  }

  return buildEndSessionUrl(client, {
    post_logout_redirect_uri: POST_LOGOUT_REDIRECT_URI,
    client_id: CLIENT_ID,
    id_token_hint,
    state,
  }).href;
});
