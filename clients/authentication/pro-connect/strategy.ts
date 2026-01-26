// Documentation ProConnect
// https://github.com/numerique-gouv/proconnect-documentation/blob/main/doc_fs/implementation_technique.md

import { type BaseClient, generators, Issuer } from "openid-client";
import { HttpForbiddenError } from "#clients/exceptions";
import { InternalError } from "#models/exceptions";
import type { LoggerContext } from "#utils/logger-context";
import getSession from "#utils/server-side-helper/get-session";
import type { IReqWithSession } from "#utils/session/with-session";
import { ProConnect2FANeeded, ProConnectReconnexionNeeded } from "./exceptions";

let _client = undefined as BaseClient | undefined;

// LEGACY
// Pro Connect was called Agent Connect in the past
const CLIENT_ID = process.env.AGENTCONNECT_CLIENT_ID;
const CLIENT_SECRET = process.env.AGENTCONNECT_CLIENT_SECRET;
const ISSUER_URL = process.env.AGENTCONNECT_URL_DISCOVER;
const REDIRECT_URI = process.env.AGENTCONNECT_REDIRECT_URI;
const POST_LOGOUT_REDIRECT_URI =
  process.env.AGENTCONNECT_POST_LOGOUT_REDIRECT_URI;
const PROCONNECT_IDP_ID = "71144ab3-ee1a-4401-b7b3-79b44f7daeeb";

const SCOPES = "openid given_name usual_name email siret idp_id";
const ACR_VALUES_2FA = [
  "eidas2", // login / pwd + 2FA
  "eidas3", // physical card with PIN + certificates
  "https://proconnect.gouv.fr/assurance/self-asserted-2fa", // declarative identity + 2FA
  "https://proconnect.gouv.fr/assurance/consistency-checked-2fa", // verified identity + 2FA
].join(" ");

export const getClient = async () => {
  if (_client) {
    return _client;
  }
  if (
    !CLIENT_ID ||
    !ISSUER_URL ||
    !CLIENT_SECRET ||
    !REDIRECT_URI ||
    !POST_LOGOUT_REDIRECT_URI
  ) {
    throw new Error("PRO CONNECT ENV variables are not defined");
  }
  const proConnectIssuer = await Issuer.discover(ISSUER_URL);

  _client = new proConnectIssuer.Client({
    client_id: CLIENT_ID,
    client_secret: CLIENT_SECRET,
    redirect_uris: [REDIRECT_URI],
    post_logout_redirect_uris: [POST_LOGOUT_REDIRECT_URI],
    id_token_signed_response_alg: "RS256",
    userinfo_signed_response_alg: "RS256",
  });

  return _client;
};

export const proConnectAuthorizeUrl = async (params: {
  req: IReqWithSession;
  force2FA?: boolean;
  loginHint?: string;
  skipStateGeneration?: boolean;
}) => {
  const { req, force2FA, loginHint, skipStateGeneration } = params;
  const client = await getClient();

  if (skipStateGeneration && !(req.session.nonce && req.session.state)) {
    throw new InternalError({
      message: "State and nonce are required when skipStateGeneration is true",
    });
  }

  const nonce = skipStateGeneration ? req.session.nonce : generators.nonce();
  const state = skipStateGeneration ? req.session.state : generators.state();

  if (!skipStateGeneration) {
    req.session.state = state;
    req.session.nonce = nonce;
    await req.session.save();
  }

  return client.authorizationUrl({
    scope: SCOPES,
    acr_values: force2FA ? ACR_VALUES_2FA : undefined,
    nonce,
    state,
    login_hint: loginHint,
    claims: {
      id_token: {
        amr: {
          essential: true,
        },
        ...(force2FA ? { acr: { essential: true } } : {}),
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
  siret?: string;
  is_external: boolean;
  label: string | null;
  is_collectivite_territoriale: boolean;
  is_service_public: boolean;
  idp_id: string;
};

export const proConnectAuthenticate = async (
  req: IReqWithSession,
  loggerContext: LoggerContext
): Promise<IProConnectUserInfo> => {
  const client = await getClient();

  const params = client.callbackParams(req.nextUrl.toString());

  loggerContext.setContext({
    "calls.proConnectAuthenticate.client.callbackParams": true,
    "proConnectAuthenticate.params.state":
      params.state?.slice(0, 8) ?? "non renseigné",
  });

  const tokenSet = await client.callback(REDIRECT_URI, params, {
    nonce: req.session.nonce,
    state: req.session.state,
  });

  loggerContext.setContext({
    "calls.proConnectAuthenticate.client.callback": true,
  });

  const used2FA = tokenSet.claims().amr?.includes("mfa");

  loggerContext.setContext({
    "proConnectAuthenticate.used2FA": used2FA,
    "proConnectAuthenticate.tokenSet.claims.amr":
      tokenSet.claims().amr?.join(" ") ?? "non renseigné",
    "proConnectAuthenticate.hasAccessToken": !!tokenSet.access_token,
  });

  const accessToken = tokenSet.access_token;

  if (!accessToken) {
    throw new HttpForbiddenError("No access token");
  }

  const userInfo = (await client.userinfo(tokenSet)) as IProConnectUserInfo;

  loggerContext.setContext({
    "calls.proConnectAuthenticate.client.userinfo": true,
    "proConnectAuthenticate.idp_id": userInfo.idp_id ?? "non renseigné",
  });

  if (!used2FA && userInfo.idp_id === PROCONNECT_IDP_ID) {
    throw new ProConnect2FANeeded({
      message: "2FA needed for ProConnect Identity Provider",
      loginHint: userInfo.email,
    });
  }

  req.session.nonce = undefined;
  req.session.state = undefined;

  req.session.proConnectTokenSet = {
    idToken: tokenSet.id_token,
    accessToken: tokenSet.access_token,
    accessTokenExpiresAt: (tokenSet.expires_at || 0) * 1000,
    refreshToken: tokenSet.refresh_token,
  };

  await req.session.save();

  return userInfo;
};

export const proConnectLogoutUrl = async (req: IReqWithSession) => {
  const client = await getClient();
  return client.endSessionUrl({
    id_token_hint: req.session?.proConnectTokenSet?.idToken,
    post_logout_redirect_uri: POST_LOGOUT_REDIRECT_URI,
  });
};

export const proConnectGetOrRefreshAccessToken = async (): Promise<string> => {
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

    const tokenSet = await client.refresh(
      session?.proConnectTokenSet?.refreshToken
    );

    session.proConnectTokenSet = {
      idToken: tokenSet.id_token,
      accessToken: tokenSet.access_token,
      accessTokenExpiresAt: tokenSet.expires_at,
      refreshToken: tokenSet.refreshToken as string,
    };

    return tokenSet.access_token as string;
  } catch (e: any) {
    throw new ProConnectReconnexionNeeded({
      cause: e,
      message: "Could not refresh ProConnect token",
    });
  }
};
