import { getIronSession } from "iron-session";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import type { ISession } from "#models/authentication/user/session";
import { Exception } from "#models/exceptions";
import {
  extractSirenOrSiretFromRechercherUrl,
  extractSirenOrSiretSlugFromUrl,
  isLikelyASiren,
  isLikelyASiret,
} from "#utils/helpers";
import logErrorInSentry from "#utils/sentry";
import { getBaseUrl } from "#utils/server-side-helper/get-base-url";
import getContentSecurityPolicy from "#utils/server-side-helper/headers/content-security-policy";
import { generateNonce } from "#utils/server-side-helper/headers/nonce";
import { sessionOptions, setVisitTimestamp } from "#utils/session";

const shouldRedirect = (path: string, search: string, url: string) => {
  try {
    if (path.startsWith("/entreprise/")) {
      const sirenOrSiretSlug = extractSirenOrSiretSlugFromUrl(path);
      if (isLikelyASiret(sirenOrSiretSlug)) {
        return new URL(`/etablissement/${sirenOrSiretSlug}`, url);
      }
      if (!isLikelyASiren(sirenOrSiretSlug)) {
        return new URL("/not-found", url);
      }
    }

    if (path.startsWith("/etablissement/")) {
      const sirenOrSiretSlug = extractSirenOrSiretSlugFromUrl(path);
      if (isLikelyASiren(sirenOrSiretSlug)) {
        return new URL(`/entreprise/${sirenOrSiretSlug}`, url);
      }
      if (!isLikelyASiret(sirenOrSiretSlug)) {
        return new URL("/not-found", url);
      }
    }

    if (path.startsWith("/rechercher")) {
      const sirenOrSiretParam = extractSirenOrSiretFromRechercherUrl(search);

      if (isLikelyASiret(sirenOrSiretParam)) {
        return new URL(`/etablissement/${sirenOrSiretParam}?redirected=1`, url);
      }
      if (isLikelyASiren(sirenOrSiretParam)) {
        return new URL(`/entreprise/${sirenOrSiretParam}?redirected=1`, url);
      }
    }
  } catch (e) {
    logErrorInSentry(
      new Exception({
        name: "FailedToRedirectInMiddleware",
        cause: e,
        context: {
          page: path,
        },
      })
    );
  }
  return null;
};

// This function can be marked `async` if using `await` inside
export async function middleware(request: NextRequest) {
  const redirection = shouldRedirect(
    request.nextUrl.pathname,
    request.nextUrl.search,
    request.url
  );

  if (redirection) {
    return NextResponse.redirect(redirection);
  }

  /**
   * siren redirection logging
   */
  const requestHeaders = new Headers(request.headers);
  const nextUrl = request.nextUrl;
  const paramIsPresent = nextUrl.search.indexOf("redirected=1") > -1;

  if (paramIsPresent) {
    // store redirection status in custom header as referrer seems missing from headers in RSC
    // isRedirected = params is present + previous page is coming from site
    const referer = requestHeaders.get("referer") || "";
    const baseURL = getBaseUrl();
    const isFromSite = referer.indexOf(baseURL) === 0;

    const isRedirected = paramIsPresent && isFromSite ? "1" : "0";
    requestHeaders.set("x-redirected", isRedirected);
  }

  /**
   * Generate CSP & nonce for this request
   *
   * How It Works (Request Flow)
   * 1. User requests page
   * 2. Middleware runs (set headers x-nonce and CSP script-src 'nonce-Xy9Pqr...')
   * 3. Server Component (app/layout.tsx) reads nonce from headers
   * 4. HTML renders <script nonce="Xy9Pqr...">matomo code</script>
   * 5. If browser sees XSS without nonce → ❌ Blocked
   */
  const nonce = generateNonce();
  requestHeaders.set("x-nonce", nonce);

  const response = NextResponse.next({
    request: {
      // Apply new request headers
      headers: requestHeaders,
    },
  });

  // Set CSP header with nonce
  response.headers.set(
    "Content-Security-Policy",
    getContentSecurityPolicy(nonce)
  );
  const session = await getIronSession<ISession>(
    request,
    response,
    sessionOptions
  );
  await setVisitTimestamp(session);

  return response;
}

export const config = {
  matcher:
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - robots.txt (robots file)
     * - etc.
     */
    "/((?!api|_next/static|images|_next/image|favicon.ico|robots.txt|opensearch.xml|protected-siren.txt|dsfr-departements).*)",
};
