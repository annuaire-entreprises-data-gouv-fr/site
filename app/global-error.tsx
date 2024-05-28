'use client';

import NextError from 'next/error';
import { useLog500ErrorAppClient } from 'hooks';

export default function GlobalError({
  error,
}: {
  error: Error & { digest?: string };
}) {
  useLog500ErrorAppClient(error);
  return (
    <html>
      <body>
        {/* This is the default Next.js error component. */}
        <NextError statusCode={500} />
      </body>
    </html>
  );
}
