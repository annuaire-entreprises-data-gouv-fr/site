import { HttpUnauthorizedError } from "#clients/exceptions";
import httpClient, { type IDefaultRequestConfig } from "#utils/network";
import getSession from "#utils/server-side-helper/app/get-session";
import { proConnectRefreshAccessToken } from "./strategy";

export async function rolesDataResourceServerClient<T>(
  config: IDefaultRequestConfig
): Promise<T> {
  const session = await getSession();
  const refreshToken = session.refreshToken;
  if (!refreshToken) {
    throw new HttpUnauthorizedError(
      "Refresh token is required for resource server"
    );
  }

  const newAccesToken = await proConnectRefreshAccessToken(refreshToken);

  return await httpClient<T>({
    ...config,
    headers: {
      Authorization: `Bearer ${newAccesToken}`,
    },
  });
}
