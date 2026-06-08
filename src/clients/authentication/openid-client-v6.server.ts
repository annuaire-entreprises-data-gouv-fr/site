import {
  type ClientMetadata,
  ClientSecretBasic,
  ClientSecretPost,
  Configuration,
  discovery,
  type TokenEndpointResponse,
  type TokenEndpointResponseHelpers,
} from "openid-client";

type TokenResponse = TokenEndpointResponse & TokenEndpointResponseHelpers;
export type OpenIdClientConfiguration = Configuration;

export const discoverClient = async (
  issuerUrl: string,
  clientId: string,
  clientSecret: string,
  metadata: Partial<ClientMetadata>
) => {
  const config = await discovery(
    new URL(issuerUrl),
    clientId,
    metadata,
    ClientSecretBasic(clientSecret)
  );

  const authMethods =
    config.serverMetadata().token_endpoint_auth_methods_supported;

  if (
    authMethods?.includes("client_secret_post") &&
    !authMethods.includes("client_secret_basic")
  ) {
    return new Configuration(
      config.serverMetadata(),
      clientId,
      metadata,
      ClientSecretPost(clientSecret)
    );
  }

  return config;
};

export const getAuthorizationCallbackUrl = (
  redirectUri: string,
  requestUrl: URL | string
) => {
  const callbackUrl = new URL(redirectUri);
  callbackUrl.search = new URL(requestUrl.toString()).search;
  return callbackUrl;
};

export const getAccessTokenExpiresAt = (tokenResponse: TokenResponse) => {
  const expiresIn = tokenResponse.expiresIn();
  return typeof expiresIn === "number" ? Date.now() + expiresIn * 1000 : 0;
};
