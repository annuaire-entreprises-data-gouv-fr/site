import { formatLog } from "../utils/format-log";
import { httpErrorHandler } from "../utils/http-error-handler";
import { type BackendError, getHeaderValue } from "./types";

const getStatus = (error: BackendError) => {
  const { response, message, isTimeout } = error;

  if (response?.status) {
    return response.status;
  }

  if (isTimeout || (message || "").toLowerCase().includes("timeout")) {
    return 408;
  }

  return 500;
};

const errorInterceptor = (error: BackendError): never => {
  const { config, response, message } = error || {};

  if (error.isAbort) {
    throw error;
  }

  const url = (config?.url || "an unknown url").slice(0, 100);
  const status = getStatus(error);
  const statusText = response?.statusText;
  const initialAgent = getHeaderValue(config?.headers, "x-initial-user-agent");
  const requestId = getHeaderValue(config?.headers, "x-request-id");

  if (status !== 404) {
    const endTime = Date.now();
    const startTime = config?.metadata?.startTime;
    console.error(
      formatLog(
        url,
        status,
        startTime ? endTime - startTime : undefined,
        (config?.method || "").toUpperCase(),
        initialAgent || "",
        requestId || ""
      )
    );
  }
  throw httpErrorHandler(url, status, statusText, message || "");
};

export default errorInterceptor;
