import { HttpServerError } from "#clients/exceptions";
import httpClient, { type IDefaultRequestConfig } from "#utils/network";
import { proConnectGetOrRefreshAccessToken } from "./strategy";

export async function rolesDataResourceServerClient<T>(
  config: IDefaultRequestConfig
): Promise<T> {
  try {
    const accessToken = await proConnectGetOrRefreshAccessToken();

    return await httpClient<T>({
      ...config,
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
  } catch (e) {
    // if proconnect refresh fails ->
    // if roles fails ->
    throw new HttpServerError("hey");
  }
}
