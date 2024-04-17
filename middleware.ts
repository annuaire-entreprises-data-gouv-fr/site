import { getIronSession } from 'iron-session';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { ISession } from '#models/user/session';
import {
  extractSirenOrSiretSlugFromUrl,
  isLikelyASiretOrSiren,
} from '#utils/helpers';
import { sessionOptions, setVisitTimestamp } from '#utils/session';

const shouldRedirect = (path: string, search: string, url: string) => {
  try {
    const sirenOrSiretSlug = extractSirenOrSiretSlugFromUrl(path);
    if (sirenOrSiretSlug) {
      if (path.startsWith('/entreprise/')) {
        if (!isLikelyASiretOrSiren(sirenOrSiretSlug)) {
          return new URL(`/404`, url);
        }

        if (sirenOrSiretSlug.length === 14) {
          return new URL(`/etablissement/${sirenOrSiretSlug}`, url);
        }
      }

      if (path.startsWith('/etablissement/')) {
        if (!isLikelyASiretOrSiren(sirenOrSiretSlug)) {
          return new URL(`/404`, url);
        }
        if (sirenOrSiretSlug.length === 9) {
          return new URL(`/entreprise/${sirenOrSiretSlug}`, url);
        }
      }
    }

    if (path.startsWith('/rechercher')) {
      const sirenOrSiretParam = extractSirenOrSiretSlugFromUrl(
        search.replaceAll(/[+]|(%20)/g, '')
      );

      if (isLikelyASiretOrSiren(sirenOrSiretParam)) {
        if (sirenOrSiretParam.length === 14) {
          return new URL(`/etablissement/${sirenOrSiretParam}`, url);
        } else if (sirenOrSiretParam.length === 9) {
          return new URL(`/entreprise/${sirenOrSiretParam}`, url);
        }
      }
    }
  } catch (e) {
    console.error(e);
  }
  return null;
};

// This function can be marked `async` if using `await` inside
export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  const redirection = shouldRedirect(
    request.nextUrl.pathname,
    request.nextUrl.search,
    request.url
  );

  if (redirection) {
    return NextResponse.redirect(redirection);
  }

  /**
   * pathname for /app router RSC
   */

  // https://github.com/vercel/next.js/issues/43704#issuecomment-1411186664
  // Store current request url in a custom header, which you can read later
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-pathname', pathname);

  /**
   * siren redirection logging
   */
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

// See "Matching Paths" below to learn more
export const config = {
  matcher: [
    '/entreprise/:path*',
    '/etablissement/:path*',
    '/rechercher/:path*',
    '/rechercher/carte/:path*',
    '/justificatif/:path*',
    '/dirigeant/:path*',
  ],
};
