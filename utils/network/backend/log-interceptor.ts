import type { AxiosRequestConfig, AxiosResponse } from "axios";
import { formatLog } from "../utils/format-log";

/**
 * Add startTime to request
 * @param config
 */
export const addStartTimeInterceptor = (config: AxiosRequestConfig) => ({
  ...config,
  metadata: { startTime: new Date().getTime() },
});

/**
 * Log into STDOUT in production
 * @param response
 */
export const logInterceptor = (response: AxiosResponse<any, any>) => {
  const endTime = new Date().getTime();
  //@ts-expect-error
  const startTime = response?.config?.metadata?.startTime;
  const initialAgent =
    (response.request?._header as string | undefined)
      ?.split("\n")
      .find((line) => line.startsWith("x-initial-user-agent:"))
      ?.split(":")[1]
      .trim() || "";
  const requestId =
    (response.request?._header as string | undefined)
      ?.split("\n")
      .find((line) => line.startsWith("x-request-id:"))
      ?.split(":")[1]
      .trim() || "";

  // logged into stdout
  console.info(
    formatLog(
      response?.config?.url || "",
      response?.status,
      startTime ? endTime - startTime : undefined,
      (response?.config?.method || "").toUpperCase(),
      initialAgent || "",
      requestId || ""
    )
  );
  return response;
};
