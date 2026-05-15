import { createMiddleware, createStart } from "@tanstack/react-start";
import getContentSecurityPolicy from "#/utils/headers/content-security-policy";
import { getBaseUrl } from "#/utils/server-side-helper/get-base-url";
import redirects from "../redirects.json" with { type: "json" };

interface RedirectRule {
  destination: string;
  permanent: boolean;
  source: string;
}

const redirectRules = redirects as RedirectRule[];

const escapeRegex = (value: string) =>
  value.replace(/[|\\{}()[\]^$+*?.]/g, "\\$&");

const sourceToRegex = (source: string) => {
  const parameterNames: string[] = [];
  const pattern = source
    .split("/")
    .map((segment) => {
      if (!segment.startsWith(":")) {
        return escapeRegex(segment);
      }

      parameterNames.push(segment.slice(1));
      return "([^/]+)";
    })
    .join("/");

  return { parameterNames, regex: new RegExp(`^${pattern}$`) };
};

const compiledRedirects = redirectRules.map((rule) => ({
  ...rule,
  ...sourceToRegex(rule.source),
}));

function getRedirectResponse(request: Request) {
  const url = new URL(request.url);

  for (const rule of compiledRedirects) {
    const match = url.pathname.match(rule.regex);
    if (!match) {
      continue;
    }

    let destination = rule.destination;
    rule.parameterNames.forEach((name, index) => {
      destination = destination.replace(`:${name}`, match[index + 1] || "");
    });

    const redirectUrl = new URL(destination, request.url);
    if (!destination.includes("?")) {
      redirectUrl.search = url.search;
    }

    return Response.redirect(redirectUrl, rule.permanent ? 308 : 307);
  }

  return null;
}

const headersAndRedirectsMiddleware = createMiddleware({
  type: "request",
}).server(async ({ request, next }) => {
  const redirectResponse = getRedirectResponse(request);
  if (redirectResponse) {
    return redirectResponse;
  }

  const result = await next();
  const pathname = new URL(request.url).pathname;
  const headers = result.response.headers;

  headers.set("Content-Security-Policy", getContentSecurityPolicy());
  headers.set("Access-Control-Allow-Origin", getBaseUrl());
  headers.set("Access-Control-Allow-Methods", "GET");
  headers.set("Access-Control-Max-Age", "86400");

  if (
    pathname === "/api/export-sirene" ||
    pathname.startsWith("/api/download/espace-agent/documents/")
  ) {
    headers.set("X-Accel-Buffering", "no");
  }

  if (
    /^\/api\/share\/button\/\d+$/.test(pathname) ||
    /^\/api\/share\/button\d+$/.test(pathname)
  ) {
    headers.set("Access-Control-Allow-Origin", "*");
  }

  if (pathname === "/api/feature-flags" || pathname === "/health") {
    headers.set("Cache-Control", "no-cache");
    headers.set("Access-Control-Max-Age", "0");
  }

  if (
    pathname === "/api/feedback/nps" ||
    pathname === "/api/hide-personal-data"
  ) {
    headers.set("Access-Control-Allow-Methods", "POST,OPTIONS");
  }

  return result;
});

export const startInstance = createStart(() => ({
  requestMiddleware: [headersAndRedirectsMiddleware],
}));
