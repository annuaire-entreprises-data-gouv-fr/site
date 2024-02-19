import { NextRequest, NextResponse } from 'next/server';
import { extractSirenOrSiretSlugFromUrl } from '#utils/helpers';

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
  const sirenOrSiretSlug = extractSirenOrSiretSlugFromUrl(
    request.nextUrl.pathname
  );
  if (sirenOrSiretSlug.length === 14) {
    return NextResponse.redirect(
      new URL(`/etablissement/${sirenOrSiretSlug}`, request.url)
    );
  }
  if (sirenOrSiretSlug.length === 9) {
    return NextResponse.redirect(
      new URL(`/entreprise/${sirenOrSiretSlug}`, request.url)
    );
  }
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: ['/entreprise/:path*', '/etablissement/:path*'],
};
