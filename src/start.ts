import { createMiddleware, createStart } from "@tanstack/react-start";
import { getCurrentSession, setVisitTimestamp } from "#/utils/session";

const shouldSkipMiddleware = (pathname: string) =>
  pathname.startsWith("/api") ||
  pathname.startsWith("/images") ||
  pathname.startsWith("/favicon.ico") ||
  pathname.startsWith("/robots.txt") ||
  pathname.startsWith("/opensearch.xml") ||
  pathname.startsWith("/protected-siren.txt") ||
  pathname.startsWith("/dsfr-departements");

const globalRequestMiddleware = createMiddleware({ type: "request" }).server(
  async ({ pathname, next }) => {
    if (shouldSkipMiddleware(pathname)) {
      return next();
    }

    const session = await getCurrentSession();
    await setVisitTimestamp(session);

    return next();
  }
);

export const startInstance = createStart(() => ({
  requestMiddleware: [globalRequestMiddleware],
}));
