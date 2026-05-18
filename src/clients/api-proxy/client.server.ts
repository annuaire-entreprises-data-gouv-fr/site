import { createServerOnlyFn } from "@tanstack/react-start";
import { getRequestHeaders } from "@tanstack/react-start/server";
import { httpGet, type IDefaultRequestConfig } from "#/utils/network";

/**
 * GET for API Proxy api
 *
 * @param route
 * @param options
 * @returns
 */
export const clientAPIProxy = createServerOnlyFn(
  async <T>(route: string, options: IDefaultRequestConfig): Promise<T> => {
    const resolvedHeaders = getRequestHeaders();
    const userAgent = resolvedHeaders.get("user-agent") || "";
    const requestId = resolvedHeaders.get("x-request-id") || "";
    return await httpGet(`${process.env.PROXY_API_URL}${route}`, {
      ...options,
      headers: {
        "X-APIkey": process.env.PROXY_API_KEY || "",
        "x-initial-user-agent": userAgent,
        "x-request-id": requestId,
        ...options?.headers,
      },
    });
  }
);
