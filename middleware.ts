import { Exception } from '#models/exceptions';
import { ISession } from '#models/user/session';
import {
  extractSirenOrSiretSlugFromUrl,
  isLikelyASiren,
  isLikelyASiret,
} from '#utils/helpers';
import logErrorInSentry from '#utils/sentry';
import { sessionOptions, setVisitTimestamp } from '#utils/session';
import { getIronSession } from 'iron-session';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

const shouldRedirect = (path: string, search: string, url: string) => {
  try {
    if (path.startsWith('/entreprise/')) {
      const sirenOrSiretSlug = extractSirenOrSiretSlugFromUrl(path);
      if (isLikelyASiret(sirenOrSiretSlug)) {
        return new URL(`/etablissement/${sirenOrSiretSlug}`, url);
      } else if (!isLikelyASiren(sirenOrSiretSlug)) {
        return new URL(`/404`, url);
      }
    }

    if (path.startsWith('/etablissement/')) {
      const sirenOrSiretSlug = extractSirenOrSiretSlugFromUrl(path);
      if (isLikelyASiren(sirenOrSiretSlug)) {
        return new URL(`/entreprise/${sirenOrSiretSlug}`, url);
      } else if (!isLikelyASiret(sirenOrSiretSlug)) {
        return new URL(`/404`, url);
      }
    }

    if (path.startsWith('/rechercher')) {
      const slug = (search.match(/terme=([^&]*)/g) || [''])[0].replaceAll(
        /[+]|(%20)/g,
        ''
      );
      const sirenOrSiretParam = extractSirenOrSiretSlugFromUrl(slug);

      if (isLikelyASiret(sirenOrSiretParam)) {
        return new URL(`/etablissement/${sirenOrSiretParam}?redirected=1`, url);
      } else if (isLikelyASiren(sirenOrSiretParam)) {
        return new URL(`/entreprise/${sirenOrSiretParam}?redirected=1`, url);
      }
    }
  } catch (e) {
    logErrorInSentry(
      new Exception({
        name: 'FailedToRedirectInMiddleware',
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
  const paramIsPresent = nextUrl.search.indexOf('redirected=1') > -1;

  if (paramIsPresent) {
    // store redirection status in custom header as referrer seems missing from headers in RSC
    // isRedirected = params is present + previous page is coming from site
    const referer = requestHeaders.get('referer') || '';
    const isFromSite = referer.indexOf('https://annuaire-entreprises') === 0;

    const isRedirected = paramIsPresent && isFromSite ? '1' : '0';
    requestHeaders.set('x-redirected', isRedirected);
  }

  const response = NextResponse.next({
    request: {
      // Apply new request headers
      headers: requestHeaders,
    },
  });
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
    '/((?!api|_next/static|images|_next/image|favicon.ico|robots.txt|opensearch.xml|protected-siren.txt|dsfr-departements).*)',
};
