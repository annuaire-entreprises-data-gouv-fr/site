import { NextRequest, NextResponse } from 'next/server';

export function redirectTo(req: NextRequest, path: string) {
  const requestUrl = new URL(req.url);
  const targetUrl = new URL(path, requestUrl.origin);

  return NextResponse.redirect(targetUrl.toString());
}
