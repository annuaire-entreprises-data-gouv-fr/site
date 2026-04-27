import type { IDefaultRequestConfig } from "..";

export interface BackendRequestConfig extends IDefaultRequestConfig {
  headers?: HeadersInit;
  metadata?: {
    startTime: number;
  };
}

export interface BackendResponse<T = unknown> {
  config: BackendRequestConfig;
  data: T;
  headers: Headers;
  status: number;
  statusText: string;
}

export interface BackendError extends Error {
  config?: BackendRequestConfig;
  isAbort?: boolean;
  isTimeout?: boolean;
  response?: BackendResponse;
}

export const getHeaderValue = (
  headers: HeadersInit | undefined,
  name: string
): string => {
  if (!headers) {
    return "";
  }

  const normalizedName = name.toLowerCase();

  if (headers instanceof Headers) {
    return headers.get(name) || "";
  }

  if (Array.isArray(headers)) {
    const entry = headers.find(
      ([headerName]) => headerName.toLowerCase() === normalizedName
    );
    return entry?.[1] || "";
  }

  for (const [headerName, value] of Object.entries(headers)) {
    if (headerName.toLowerCase() === normalizedName) {
      return Array.isArray(value) ? value.join(", ") : `${value}`;
    }
  }

  return "";
};
