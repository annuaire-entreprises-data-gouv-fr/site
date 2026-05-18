import { formatLog } from "../utils/format-log";
import {
  type BackendRequestConfig,
  type BackendResponse,
  getHeaderValue,
} from "./types";

/**
 * Add startTime to request
 * @param config
 */
export const addStartTimeInterceptor = (config: BackendRequestConfig) => ({
  ...config,
  metadata: { startTime: Date.now() },
});

/**
 * Log into STDOUT in production
 * @param response
 */
export const logInterceptor = <T>(response: BackendResponse<T>) => {
  const endTime = Date.now();
  const startTime = response?.config?.metadata?.startTime;
  const initialAgent = getHeaderValue(
    response.config.headers,
    "x-initial-user-agent"
  );
  const requestId = getHeaderValue(response.config.headers, "x-request-id");

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
