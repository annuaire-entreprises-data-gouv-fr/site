import { randomBytes } from "node:crypto";
import { createServerOnlyFn } from "@tanstack/react-start";
import { getRequestUrl } from "@tanstack/react-start/server";
import {
  authorizationCodeGrant,
  buildAuthorizationUrl,
  buildEndSessionUrl,
  fetchUserInfo,
  randomNonce,
  randomState,
} from "openid-client";
import { HttpForbiddenError } from "#/clients/exceptions";
import { InternalError } from "#/models/exceptions";
import {
  getCurrentSession,
  getHidePersonalDataRequestFCSession,
} from "#/utils/session/index.server";
import {
  discoverClient,
  getAuthorizationCallbackUrl,
  type OpenIdClientConfiguration,
} from "../openid-client-v6.server";

let _client = undefined as OpenIdClientConfiguration | undefined;

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
    !(
      CLIENT_ID &&
      URL &&
      CLIENT_SECRET &&
      REDIRECT_URI &&
      POST_LOGOUT_REDIRECT_URI
    )
  ) {
    throw new InternalError({
      message: "FRANCE CONNECT ENV variables are not defined",
    });
  }
  _client = await discoverClient(
    `${URL}/api/v2/.well-known/openid-configuration`,
    CLIENT_ID,
    CLIENT_SECRET,
    {
      redirect_uris: [REDIRECT_URI],
      post_logout_redirect_uris: [POST_LOGOUT_REDIRECT_URI],
      id_token_signed_response_alg: "RS256",
      userinfo_signed_response_alg: "RS256",
      response_types: ["code"],
    }
  );

  return _client;
});

export const franceConnectAuthorizeUrl = createServerOnlyFn(async () => {
  const client = await getClient();
  const session = await getCurrentSession();
  const { REDIRECT_URI } = getConfig();
  const FC_CONNECT_CHECK = {
    state: randomState(),
    nonce: randomNonce(),
  };
  await session.update({ FC_CONNECT_CHECK });

  return buildAuthorizationUrl(client, {
    scope: `openid ${franceConnectScope.join(" ")}`,
    redirect_uri: REDIRECT_URI as string,
    acr_values: "eidas1",
    ...FC_CONNECT_CHECK,
  }).toString();
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
    const { REDIRECT_URI } = getConfig();
    const tokenSet = await authorizationCodeGrant(
      client,
      getAuthorizationCallbackUrl(REDIRECT_URI as string, url),
      {
        expectedNonce: session.data.FC_CONNECT_CHECK?.nonce,
        expectedState: session.data.FC_CONNECT_CHECK?.state,
      }
    );
    await session.update({ FC_CONNECT_CHECK: undefined });

    const { access_token, id_token } = tokenSet;
    const claims = tokenSet.claims();
    if (!(access_token && id_token && claims?.sub)) {
      throw new HttpForbiddenError("No access token");
    }

    const userInfo = await fetchUserInfo(client, access_token, claims.sub);
    return {
      ...userInfo,
      id_token,
      sub: userInfo.sub,
    } as IFranceConnectUserInfo;
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

  return buildEndSessionUrl(client, {
    post_logout_redirect_uri: POST_LOGOUT_REDIRECT_URI as string,
    client_id: CLIENT_ID as string,
    id_token_hint,
    state,
  }).toString();
});
