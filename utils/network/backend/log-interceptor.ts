import type { AxiosRequestConfig, AxiosResponse } from "axios";
import { getLoggerContext } from "#utils/logger/logger-context";
import { formatLog } from "../utils/format-log";

/**
 * Add startTime to request
 * @param config
 */
export const addStartTimeInterceptor = (config: AxiosRequestConfig) => ({
  ...config,
  metadata: { startTime: Date.now() },
});

/**
 * Log into STDOUT in production
 * @param response
 */
export const logInterceptor = (response: AxiosResponse<any, any>) => {
  const endTime = Date.now();
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

  const loggerContext = getLoggerContext();
  if (loggerContext) {
    loggerContext.serviceSuccess({
      startTimeMs: startTime,
      service: {
        name: "backend",
        type: "http",
        url: {
          url: response?.config?.url || "an unknown url",
          params: response?.config?.params,
          method: response?.config?.method,
        },
      },
    });
  }
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
