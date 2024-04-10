import { getIronSession } from 'iron-session';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { ISession } from '#models/user/session';
import { extractSirenOrSiretSlugFromUrl } from '#utils/helpers';
import { sessionOptions, setVisitTimestamp } from '#utils/session';

// This function can be marked `async` if using `await` inside
export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const sirenOrSiretSlug = extractSirenOrSiretSlugFromUrl(pathname);

  const isEntreprisePage = pathname.startsWith('/entreprise/');

  if (isEntreprisePage && sirenOrSiretSlug.length === 14) {
    return NextResponse.redirect(
      new URL(`/etablissement/${sirenOrSiretSlug}`, request.url)
    );
  }

  const isEtablissementPage = pathname.startsWith('/etablissement/');

  if (isEtablissementPage && sirenOrSiretSlug.length === 9) {
    return NextResponse.redirect(
      new URL(`/entreprise/${sirenOrSiretSlug}`, request.url)
    );
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
  matcher: ['/entreprise/:path*', '/etablissement/:path*'],
};
