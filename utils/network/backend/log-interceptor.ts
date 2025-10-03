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

  // logged into stdout
  // eslint-disable-next-line no-console
  console.info(
    formatLog(
      response?.config?.url || "",
      response?.status,
      startTime ? endTime - startTime : undefined,
      (response?.config?.method || "").toUpperCase()
    )
  );
  return response;
};
