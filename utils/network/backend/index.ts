import { Readable } from "node:stream";
import type { ReadableStream as NodeReadableStream } from "node:stream/web";
import { Agent } from "undici";
import constants from "#models/constants";
import type { IDefaultRequestConfig } from "..";
import errorInterceptor from "./error-interceptor";
import { addStartTimeInterceptor, logInterceptor } from "./log-interceptor";
import type {
  BackendError,
  BackendRequestConfig,
  BackendResponse,
} from "./types";

/**
 * Limit the number of sockets allocated per distant hosts and reuse them.
 */
const dispatcher = new Agent({
  connections: 128,
  keepAliveMaxTimeout: 1000,
  keepAliveTimeout: 1000,
});

const DEFAULT_TIMEOUT = constants.timeout.L;

const buildUrl = (url: string, params: IDefaultRequestConfig["params"]) => {
  if (!params) {
    return url;
  }

  const serializedParams = new URLSearchParams(params).toString();
  if (!serializedParams) {
    return url;
  }

  const separator = url.includes("?") ? "&" : "?";
  return `${url}${separator}${serializedParams}`;
};

const isPlainObject = (value: unknown): value is Record<string, unknown> =>
  Object.prototype.toString.call(value) === "[object Object]";

const toFormUrlEncoded = (data: Record<string, unknown>) => {
  const params = new URLSearchParams();

  for (const [key, value] of Object.entries(data)) {
    if (value === undefined || value === null) {
      continue;
    }

    if (Array.isArray(value)) {
      for (const entry of value) {
        params.append(key, `${entry}`);
      }
      continue;
    }

    params.append(key, `${value}`);
  }

  return params.toString();
};

const serializeBody = (
  data: unknown,
  headers: Headers
): BodyInit | undefined => {
  if (data === undefined || data === null) {
    return;
  }

  if (
    typeof data === "string" ||
    data instanceof URLSearchParams ||
    data instanceof FormData ||
    data instanceof Blob ||
    data instanceof ArrayBuffer
  ) {
    return data;
  }

  if (ArrayBuffer.isView(data)) {
    return Uint8Array.from(
      new Uint8Array(data.buffer, data.byteOffset, data.byteLength)
    ).buffer;
  }

  const contentType = headers.get("content-type")?.toLowerCase() || "";

  if (
    isPlainObject(data) &&
    contentType.includes("application/x-www-form-urlencoded")
  ) {
    return toFormUrlEncoded(data);
  }

  if (isPlainObject(data)) {
    if (!headers.has("content-type")) {
      headers.set("content-type", "application/json");
    }
    return JSON.stringify(data);
  }

  return `${data}`;
};

const parseResponse = async <T>(
  response: Response,
  responseType: IDefaultRequestConfig["responseType"]
): Promise<T> => {
  if (responseType === "blob") {
    return (await response.blob()) as T;
  }

  if (responseType === "arraybuffer") {
    return (await response.arrayBuffer()) as T;
  }

  if (responseType === "stream") {
    return Readable.fromWeb(response.body as NodeReadableStream) as T;
  }

  const contentType = response.headers.get("content-type")?.toLowerCase() || "";
  const isJson =
    contentType.includes("application/json") || contentType.includes("+json");

  return (await (isJson ? response.json() : response.text())) as T;
};

const createFetchError = (
  config: BackendRequestConfig,
  error: unknown,
  timeoutSignal: AbortSignal,
  callerSignal?: AbortSignal
) => {
  const backendError = (
    error instanceof Error
      ? error
      : new Error(
          timeoutSignal.aborted
            ? `timeout of ${config.timeout || DEFAULT_TIMEOUT}ms exceeded`
            : `${error}`
        )
  ) as BackendError;

  if (timeoutSignal.aborted) {
    backendError.message = `timeout of ${config.timeout || DEFAULT_TIMEOUT}ms exceeded`;
  }

  backendError.config ??= config;
  if (backendError !== error) {
    backendError.cause = error;
  }
  backendError.isAbort = !!callerSignal?.aborted && !timeoutSignal.aborted;
  backendError.isTimeout = timeoutSignal.aborted;

  return backendError;
};

async function httpBackClient<T>(config: IDefaultRequestConfig): Promise<T> {
  const timeout = config.timeout || DEFAULT_TIMEOUT;
  const timeoutSignal = AbortSignal.timeout(timeout);
  const signal = config.signal
    ? AbortSignal.any([timeoutSignal, config.signal])
    : timeoutSignal;
  const headers = new Headers({
    "User-Agent": "annuaire-entreprises-site",
    ...(config.headers || {}),
  });
  const requestConfig = addStartTimeInterceptor({
    ...config,
    headers,
    method: config.method || "GET",
    signal,
    timeout,
  });
  const body =
    requestConfig.method === "GET"
      ? undefined
      : serializeBody(config.data, headers);

  try {
    const response = await fetch(buildUrl(config.url || "", config.params), {
      body,
      dispatcher,
      headers,
      method: requestConfig.method,
      signal,
    } as RequestInit & { dispatcher: Agent });

    if (!response.ok) {
      const error = new Error(
        `Request failed with status code ${response.status}`
      ) as BackendError;
      error.config = requestConfig;
      error.response = {
        config: requestConfig,
        data: undefined,
        headers: response.headers,
        status: response.status,
        statusText: response.statusText,
      };
      throw error;
    }

    const data = await parseResponse<T>(response, config.responseType);
    const backendResponse: BackendResponse<T> = {
      config: requestConfig,
      data,
      headers: response.headers,
      status: response.status,
      statusText: response.statusText,
    };

    logInterceptor(backendResponse);

    return backendResponse.data;
  } catch (error) {
    return errorInterceptor(
      createFetchError(requestConfig, error, timeoutSignal, config.signal)
    );
  }
}

export { httpBackClient };

export default httpBackClient;
