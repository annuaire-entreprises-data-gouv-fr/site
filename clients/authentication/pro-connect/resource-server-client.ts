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
    throw e;
  }
}
