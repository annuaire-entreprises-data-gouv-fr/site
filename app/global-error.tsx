'use client';

import NextError from 'next/error';
import { useLogFatalErrorAppClient } from 'hooks';

export default function GlobalError({
  error,
}: {
  error: Error & { digest?: string };
}) {
  useLogFatalErrorAppClient(error);
  return (
    <html>
      <body>
        {/* This is the default Next.js error component. */}
        <NextError statusCode={500} />
      </body>
    </html>
  );
}
