import { useEffect } from 'react';
import { Exception } from '#models/exceptions';
import { logFatalErrorInSentry } from '#utils/sentry';
export type NextAppError = Error & { digest?: string };
export function useLogFatalErrorAppClient(error: Error & { digest?: string }) {
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
}
