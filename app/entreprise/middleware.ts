import type { NextRequest } from 'next/server';

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
  console.log(
    request,
    request.nextUrl,
    request.nextUrl.pathname,
    request.nextUrl.searchParams
  );
  // const sirenOrSiretSlug = extractSirenOrSiretSlugFromUrl();
  // if (sirenOrSiretSlug.length === 14) {
  //   return NextResponse.redirect(new URL('/etablissement', sirenOrSiretSlug));
  // }
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: '/entreprise/:slug*',
};
