import { Readable } from "node:stream";
import type { ReadableStream as NodeReadableStream } from "node:stream/web";
import { HttpError } from "#clients/exceptions";
import constants from "#models/constants";
import type { IDefaultRequestConfig } from "..";
import { formatLog } from "../utils/format-log";
import { httpErrorHandler } from "../utils/http-error-handler";

const DEFAULT_TIMEOUT = constants.timeout.L;

const toUrlSearchParams = (params: unknown) => {
  if (params instanceof URLSearchParams) {
    return params;
  }
  const searchParams = new URLSearchParams();
  if (!params || typeof params !== "object") {
    return searchParams;
  }

  for (const [key, value] of Object.entries(params)) {
    if (value === undefined || value === null) {
      continue;
    }
    if (Array.isArray(value)) {
      for (const item of value) {
        searchParams.append(key, String(item));
      }
      continue;
    }
    searchParams.append(key, String(value));
  }

  return searchParams;
};

const buildUrl = (url: string, params: unknown) => {
  if (!params) {
    return url;
  }
  const serializedParams = toUrlSearchParams(params).toString();
  if (!serializedParams) {
    return url;
  }
  const separator = url.includes("?") ? "&" : "?";
  return `${url}${separator}${serializedParams}`;
};

const formatErrorMessage = (value: unknown) => {
  if (typeof value === "string") {
    return value;
  }
  if (value === null || value === undefined) {
    return "";
  }
  if (value instanceof Error) {
    return value.message || value.name;
  }
  try {
    return JSON.stringify(value);
  } catch {
    return String(value);
  }
};

const readResponseMessage = async (response: Response) => {
  const isJson = response.headers
    .get("content-type")
    ?.includes("application/json");
  try {
    if (isJson) {
      return formatErrorMessage(await response.json());
    }
    return await response.text();
  } catch {
    return "";
  }
};

const resolveBody = (data: unknown, headers: Headers): BodyInit | undefined => {
  if (data === undefined || data === null) {
    return;
  }
  if (
    typeof data === "string" ||
    data instanceof ArrayBuffer ||
    ArrayBuffer.isView(data) ||
    data instanceof Blob ||
    data instanceof FormData ||
    data instanceof URLSearchParams ||
    data instanceof ReadableStream
  ) {
    return data as BodyInit;
  }

  const contentType = headers.get("content-type") || "";
  if (contentType.includes("application/x-www-form-urlencoded")) {
    return toUrlSearchParams(data).toString();
  }
  if (!contentType) {
    headers.set("content-type", "application/json");
  }
  return JSON.stringify(data);
};

const getHeaderValue = (headers: Headers, key: string) =>
  headers.get(key) || "";

async function httpBackClient<T>(config: IDefaultRequestConfig): Promise<T> {
  if (!config.url) {
    throw new Error("Url is required");
  }

  const startTime = Date.now();
  const timeout = config.timeout || DEFAULT_TIMEOUT;
  const timeoutSignal = AbortSignal.timeout(config.timeout || DEFAULT_TIMEOUT);
  const signal = config.signal
    ? AbortSignal.any([timeoutSignal, config.signal])
    : timeoutSignal;

  const headers = new Headers({
    "User-Agent": "annuaire-entreprises-site",
  });

  const inputHeaders = config.headers;
  if (inputHeaders instanceof Headers) {
    for (const [key, value] of inputHeaders.entries()) {
      headers.set(key, value);
    }
  } else if (inputHeaders) {
    for (const [key, value] of Object.entries(inputHeaders)) {
      if (value !== undefined && value !== null) {
        headers.set(key, String(value));
      }
    }
  }

  const method = config.method || "GET";
  const url = buildUrl(config.url, config.params);
  const body = resolveBody(config.data, headers);
  const initialAgent = getHeaderValue(headers, "x-initial-user-agent");
  const requestId = getHeaderValue(headers, "x-request-id");

  try {
    const response = await fetch(url, {
      method,
      headers,
      body,
      signal,
      cache: "no-store",
    });

    const duration = Date.now() - startTime;

    if (!response.ok) {
      const message = await readResponseMessage(response);
      if (response.status !== 404) {
        console.error(
          formatLog(
            url.substring(0, 100),
            response.status,
            duration,
            method,
            initialAgent,
            requestId
          )
        );
      }
      httpErrorHandler(
        url.substring(0, 100),
        response.status,
        response.statusText,
        message
      );
    }

    console.info(
      formatLog(url, response.status, duration, method, initialAgent, requestId)
    );

    if (config.responseType === "blob") {
      return (await response.blob()) as T;
    }

    if (config.responseType === "arraybuffer") {
      return (await response.arrayBuffer()) as T;
    }

    if (config.responseType === "stream") {
      if (!response.body) {
        return Readable.from([]) as T;
      }
      return Readable.fromWeb(
        response.body as unknown as NodeReadableStream
      ) as T;
    }

    const isJson = response.headers
      .get("content-type")
      ?.includes("application/json");

    const data = await (isJson ? response.json() : response.text());

    return data as T;
  } catch (error) {
    if (config.signal?.aborted && !timeoutSignal.aborted) {
      throw error;
    }

    const status =
      error instanceof HttpError
        ? error.status
        : timeoutSignal.aborted
          ? 408
          : 500;
    const statusText = timeoutSignal.aborted ? "Request Timeout" : undefined;
    const message =
      error instanceof HttpError
        ? error.message
        : timeoutSignal.aborted
          ? `timeout of ${timeout}ms exceeded`
          : formatErrorMessage(error);

    console.error(
      formatLog(
        config.url.substring(0, 100),
        status,
        Date.now() - startTime,
        method,
        initialAgent,
        requestId
      )
    );

    if (error instanceof HttpError) {
      throw error;
    }

    httpErrorHandler(config.url.substring(0, 100), status, statusText, message);

    throw error;
  }
}

export { httpBackClient };

export default httpBackClient;
