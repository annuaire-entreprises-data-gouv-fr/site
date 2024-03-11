'use client';

import { useEffect } from 'react';
import { ClientErrorExplanations } from '#components/error-explanations';
import { LayoutDefault } from '#components/layouts/layout-default';
import { Exception } from '#models/exceptions';
import { logFatalErrorInSentry } from '#utils/sentry';

export default function ErrorPage({
  error,
}: {
  error: Error & { digest?: string };
}) {
  useEffect(() => {
    // Log the error to Sentry
    logFatalErrorInSentry(
      new Exception({
        name: 'ClientErrorPageDisplayed',
        cause: error,
        context: {
          digest: error.digest,
          page: window.location.pathname,
        },
      })
    );
  }, [error]);

  return (
    <LayoutDefault>
      <ClientErrorExplanations />
    </LayoutDefault>
  );
}
