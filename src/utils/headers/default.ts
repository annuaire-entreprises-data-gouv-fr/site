import { getBaseUrl } from "../get-base-url";
import getContentSecurityPolicy from "./content-security-policy";

export const getDefaultHeaders = (
  extraHeaders: Record<string, string> = {}
) => ({
  "Content-Security-Policy": getContentSecurityPolicy(),
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "Access-Control-Allow-Origin": getBaseUrl(),
  "Access-Control-Allow-Methods": "GET",
  "Access-Control-Max-Age": "86400",
  ...extraHeaders,
});
