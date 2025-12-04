import type { AxiosError, AxiosResponse } from "axios";
import { formatLog } from "../utils/format-log";
import { httpErrorHandler } from "../utils/http-error-handler";

const getStatus = (response?: AxiosResponse, message?: string) => {
  if (response?.status) {
    return response.status;
  }
  if ((message || "").indexOf("timeout of") > -1) {
    return 408;
  }
  return 500;
};

const errorInterceptor = (error: AxiosError) => {
  const { config, response, message } = error || {};

  const url = (config?.url || "an unknown url").substring(0, 100);
  const status = getStatus(response, message);
  const statusText = response?.statusText;
  const initialAgent =
    (error.request?._header as string | undefined)
      ?.split("\n")
      .find((line) => line.startsWith("x-initial-user-agent:"))
      ?.split(":")[1]
      .trim() || "";
  const requestId =
    (error.request?._header as string | undefined)
      ?.split("\n")
      .find((line) => line.startsWith("x-request-id:"))
      ?.split(":")[1]
      .trim() || "";

  if (status !== 404) {
    const endTime = new Date().getTime();
    //@ts-expect-error
    const startTime = config?.metadata?.startTime;
    console.error(
      formatLog(
        url,
        status,
        startTime ? endTime - startTime : undefined,
        error.request?.method,
        initialAgent || "",
        requestId || ""
      )
    );
  }
  httpErrorHandler(url, status, statusText, message);
};

export default errorInterceptor;
