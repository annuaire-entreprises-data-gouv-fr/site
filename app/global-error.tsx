"use client";

import { useLog500ErrorAppClient } from "hooks";
import NextError from "next/error";

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
