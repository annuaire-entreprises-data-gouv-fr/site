// Documentation ProConnect
// https://github.com/numerique-gouv/proconnect-documentation/blob/main/doc_fs/implementation_technique.md

import { createServerOnlyFn } from "@tanstack/react-start";
import { getRequestUrl } from "@tanstack/react-start/server";
import {
  authorizationCodeGrant,
  buildAuthorizationUrl,
  buildEndSessionUrl,
  fetchUserInfo,
  randomNonce,
  randomState,
  refreshTokenGrant,
} from "openid-client";
import { HttpForbiddenError } from "#/clients/exceptions";
import { InternalError } from "#/models/exceptions";
import getSession from "#/utils/server-side-helper/get-session";
import {
  getCurrentSession,
  setProConnectTokenSet,
  setStateAndNonce,
} from "#/utils/session/index.server";
import {
  discoverClient,
  getAccessTokenExpiresAt,
  getAuthorizationCallbackUrl,
  type OpenIdClientConfiguration,
} from "../openid-client-v6.server";
import { ProConnect2FANeeded, ProConnectReconnexionNeeded } from "./exceptions";

let _client = undefined as OpenIdClientConfiguration | undefined;

// LEGACY
// Pro Connect was called Agent Connect in the past
const getConfig = () => ({
  CLIENT_ID: process.env.AGENTCONNECT_CLIENT_ID,
  CLIENT_SECRET: process.env.AGENTCONNECT_CLIENT_SECRET,
  ISSUER_URL: process.env.AGENTCONNECT_URL_DISCOVER,
  REDIRECT_URI: process.env.AGENTCONNECT_REDIRECT_URI,
  POST_LOGOUT_REDIRECT_URI: process.env.AGENTCONNECT_POST_LOGOUT_REDIRECT_URI,
});
const PROCONNECT_IDP_ID = "71144ab3-ee1a-4401-b7b3-79b44f7daeeb";

const SCOPES = "openid given_name usual_name email siret idp_id";
const ACR_VALUES_2FA = [
  "eidas2", // login / pwd + 2FA
  "eidas3", // physical card with PIN + certificates
  "eidas0-mfa", // declarative identity + 2FA
  "eidas1-mfa", // verified identity + 2FA
].join(" ");

export const getClient = createServerOnlyFn(async () => {
  if (_client) {
    return _client;
  }
  const {
    CLIENT_ID,
    CLIENT_SECRET,
    ISSUER_URL,
    REDIRECT_URI,
    POST_LOGOUT_REDIRECT_URI,
  } = getConfig();
  if (
    !(
      CLIENT_ID &&
      ISSUER_URL &&
      CLIENT_SECRET &&
      REDIRECT_URI &&
      POST_LOGOUT_REDIRECT_URI
    )
  ) {
    throw new Error("PRO CONNECT ENV variables are not defined");
  }
  _client = await discoverClient(ISSUER_URL, CLIENT_ID, CLIENT_SECRET, {
    redirect_uris: [REDIRECT_URI],
    post_logout_redirect_uris: [POST_LOGOUT_REDIRECT_URI],
    id_token_signed_response_alg: "RS256",
    userinfo_signed_response_alg: "RS256",
  });

  return _client;
});

export const proConnectAuthorizeUrl = createServerOnlyFn(
  async (params: {
    force2FA?: boolean;
    loginHint?: string;
    skipStateGeneration?: boolean;
  }) => {
    const { force2FA, loginHint, skipStateGeneration } = params;
    const client = await getClient();
    const session = await getCurrentSession();
    const { REDIRECT_URI } = getConfig();

    if (skipStateGeneration && !(session.data.nonce && session.data.state)) {
      throw new InternalError({
        message:
          "State and nonce are required when skipStateGeneration is true",
      });
    }

    const nonce = skipStateGeneration ? session.data.nonce : randomNonce();
    const state = skipStateGeneration ? session.data.state : randomState();

    if (!skipStateGeneration) {
      await setStateAndNonce(session, state, nonce);
    }

    const claims = {
      id_token: {
        amr: {
          essential: true,
        },
        ...(force2FA ? { acr: { essential: true } } : {}),
      },
    };

    const authorizationParameters: Record<string, string> = {
      scope: SCOPES,
      redirect_uri: REDIRECT_URI as string,
      nonce: nonce as string,
      state: state as string,
      claims: JSON.stringify(claims),
    };

    if (force2FA) {
      authorizationParameters.acr_values = ACR_VALUES_2FA;
    }

    if (loginHint) {
      authorizationParameters.login_hint = loginHint;
    }

    return buildAuthorizationUrl(client, authorizationParameters).toString();
  }
);

export interface IProConnectUserInfo {
  email: string;
  email_verified: boolean;
  family_name: string | null;
  given_name: string | null;
  idp_id: string;
  is_collectivite_territoriale: boolean;
  is_external: boolean;
  is_service_public: boolean;
  job: string | null;
  label: string | null;
  phone_number: string | null;
  siret?: string;
  sub: string;
}

export const proConnectAuthenticate = createServerOnlyFn(
  async (): Promise<IProConnectUserInfo> => {
    const client = await getClient();
    const session = await getCurrentSession();
    const url = getRequestUrl();
    const { REDIRECT_URI } = getConfig();

    const tokenSet = await authorizationCodeGrant(
      client,
      getAuthorizationCallbackUrl(REDIRECT_URI as string, url),
      {
        expectedNonce: session.data.nonce,
        expectedState: session.data.state,
      }
    );

    const claims = tokenSet.claims();
    const used2FA = Array.isArray(claims?.amr) && claims.amr.includes("mfa");

    const accessToken = tokenSet.access_token;

    if (!(accessToken && claims?.sub)) {
      throw new HttpForbiddenError("No access token");
    }

    const userInfo = (await fetchUserInfo(
      client,
      accessToken,
      claims.sub
    )) as unknown as IProConnectUserInfo;

    if (
      !used2FA &&
      userInfo.idp_id === PROCONNECT_IDP_ID &&
      !process.env.AGENT_BYPASS_2FA?.includes(userInfo.email)
    ) {
      throw new ProConnect2FANeeded({
        message: "2FA needed for ProConnect Identity Provider",
        loginHint: userInfo.email,
      });
    }

    await setProConnectTokenSet(session, {
      idToken: tokenSet.id_token,
      accessToken: tokenSet.access_token,
      accessTokenExpiresAt: getAccessTokenExpiresAt(tokenSet),
      refreshToken: tokenSet.refresh_token,
    });

    return userInfo;
  }
);

export const proConnectLogoutUrl = createServerOnlyFn(async () => {
  const session = await getCurrentSession();
  const client = await getClient();
  const { POST_LOGOUT_REDIRECT_URI } = getConfig();
  const logoutParameters: Record<string, string> = {
    post_logout_redirect_uri: POST_LOGOUT_REDIRECT_URI as string,
  };

  if (session.data.proConnectTokenSet?.idToken) {
    logoutParameters.id_token_hint = session.data.proConnectTokenSet.idToken;
  }

  return buildEndSessionUrl(client, logoutParameters).toString();
});

export const proConnectGetOrRefreshAccessToken = createServerOnlyFn(
  async (): Promise<string> => {
    const session = await getSession();

    if (
      !(
        session?.proConnectTokenSet?.accessToken &&
        session?.proConnectTokenSet?.accessTokenExpiresAt &&
        session?.proConnectTokenSet?.refreshToken
      )
    ) {
      throw new HttpForbiddenError(
        "Access token and refresh token are needed to refresh token"
      );
    }

    const accessTokenTimeToLive =
      session.proConnectTokenSet.accessTokenExpiresAt - Date.now();

    if (accessTokenTimeToLive > 5000) {
      return session.proConnectTokenSet.accessToken;
    }

    try {
      const client = await getClient();
      const refreshToken = session.proConnectTokenSet.refreshToken;

      const tokenSet = await refreshTokenGrant(client, refreshToken);

      session.proConnectTokenSet = {
        idToken: tokenSet.id_token,
        accessToken: tokenSet.access_token,
        accessTokenExpiresAt: getAccessTokenExpiresAt(tokenSet),
        refreshToken: tokenSet.refresh_token ?? refreshToken,
      };

      return tokenSet.access_token as string;
    } catch (e: any) {
      throw new ProConnectReconnexionNeeded({
        cause: e,
        message: "Could not refresh ProConnect token",
      });
    }
  }
);
