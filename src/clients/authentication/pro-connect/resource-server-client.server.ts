import { createServerOnlyFn } from "@tanstack/react-start";
import httpClient, { type IDefaultRequestConfig } from "#/utils/network";
import { proConnectGetOrRefreshAccessToken } from "./strategy.server";

export const rolesDataResourceServerClient = createServerOnlyFn(
  async <T>(config: IDefaultRequestConfig): Promise<T> => {
    const accessToken = await proConnectGetOrRefreshAccessToken();

    return await httpClient<T>({
      ...config,
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
  }
);
