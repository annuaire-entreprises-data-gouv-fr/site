import { createMiddleware } from "@tanstack/react-start";
import { getDefaultHeaders } from "#/utils/headers/default";

export const defaultHeadersMiddleware = (
  extraHeaders: Record<string, string> = {}
) =>
  createMiddleware({ type: "request" }).server(async ({ next }) => {
    const headers = getDefaultHeaders(extraHeaders);
    const result = await next();

    for (const [key, value] of Object.entries(headers)) {
      if (!result.response.headers.has(key)) {
        result.response.headers.set(key, value);
      }
    }

    return result;
  });
