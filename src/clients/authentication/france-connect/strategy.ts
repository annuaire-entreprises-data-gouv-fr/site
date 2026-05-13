import { randomBytes } from "node:crypto";
import { getRequestUrl } from "@tanstack/react-start/server";
import { type BaseClient, generators, Issuer } from "openid-client";
import { HttpForbiddenError } from "#/clients/exceptions";
import { InternalError } from "#/models/exceptions";
import {
  getCurrentSession,
  getHidePersonalDataRequestFCSession,
} from "#/utils/session";

let _client = undefined as BaseClient | undefined;

const CLIENT_ID = process.env.FRANCE_CONNECT_CLIENT_ID;
const URL = process.env.FRANCE_CONNECT_URL;
const CLIENT_SECRET = process.env.FRANCE_CONNECT_CLIENT_SECRET;
const REDIRECT_URI = process.env.FRANCE_CONNECT_REDIRECT_URI;
const POST_LOGOUT_REDIRECT_URI =
  process.env.FRANCE_CONNECT_POST_LOGOUT_REDIRECT_URI;

export const getClient = async () => {
  if (_client) {
    return _client;
  }
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
  const franceConnectIssuer = await Issuer.discover(
    `${URL}/api/v2/.well-known/openid-configuration`
  );

  _client = new franceConnectIssuer.Client({
    client_id: CLIENT_ID,
    client_secret: CLIENT_SECRET,
    redirect_uris: [REDIRECT_URI],
    post_logout_redirect_uris: [POST_LOGOUT_REDIRECT_URI],
    id_token_signed_response_alg: "RS256",
    userinfo_signed_response_alg: "RS256",
    response_types: ["code"],
  });

  return _client;
};

export const franceConnectAuthorizeUrl = async () => {
  const client = await getClient();
  const session = await getCurrentSession();
  const FC_CONNECT_CHECK = {
    state: generators.state(),
    nonce: generators.nonce(),
  };
  await session.update({ FC_CONNECT_CHECK });

  return client.authorizationUrl({
    scope: "openid " + franceConnectScope.join(" "),
    acr_values: "eidas1",
    ...FC_CONNECT_CHECK,
  });
};
const franceConnectScope = ["family_name", "given_name", "birthdate"] as const;

export type IFranceConnectUserInfo = Partial<
  Record<(typeof franceConnectScope)[number], string | undefined>
> & {
  id_token: string;
  sub: string;
};

export async function franceConnectAuthenticate(): Promise<IFranceConnectUserInfo> {
  const client = await getClient();
  const session = await getCurrentSession();
  const url = getRequestUrl();
  const params = client.callbackParams(url.toString());
  const tokenSet = await client.callback(
    // reuse redirect_uri
    REDIRECT_URI,
    params,
    session.data.FC_CONNECT_CHECK
  );
  await session.update({ FC_CONNECT_CHECK: undefined });

  const { access_token, id_token } = tokenSet;
  if (!access_token || !id_token) {
    throw new HttpForbiddenError("No access token");
  }

  const userInfo = await client.userinfo(access_token);
  return { ...userInfo, id_token, sub: userInfo.sub };
}

export const franceConnectLogoutUrl = async () => {
  const session = await getCurrentSession();
  const franceConnect = getHidePersonalDataRequestFCSession(session.data);
  const id_token_hint = franceConnect?.tokenId;
  if (!id_token_hint) {
    throw new InternalError({ message: "No token id" });
  }
  const client = await getClient();

  const state = `state${randomBytes(32).toString("hex")}`;

  await session.update({ franceConnectHidePersonalDataSession: undefined });

  return client.endSessionUrl({
    post_logout_redirect_uri: POST_LOGOUT_REDIRECT_URI,
    client_id: CLIENT_ID,
    id_token_hint,
    state,
  });
};
