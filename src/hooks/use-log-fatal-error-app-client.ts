import { useEffect } from "react";
import { Exception } from "#/models/exceptions";
import { logFatalErrorInSentry } from "#/utils/sentry";
export type NextAppError = Error & { digest?: string };

function getErrorDigest(error: unknown): string | undefined {
  if (
    typeof error === "object" &&
    error !== null &&
    "digest" in error &&
    typeof error.digest === "string"
  ) {
    return error.digest;
  }
}

export function useLogFatalErrorAppClient(error: unknown) {
  useEffect(() => {
    // Log the error to Sentry
    logFatalErrorInSentry(
      new Exception({
        name: "ClientErrorPageDisplayed",
        cause: error,
        context: {
          digest: getErrorDigest(error),
          page: window.location.pathname,
        },
      })
    );
  }, [error]);
}

export function useLog500ErrorAppClient(error: unknown) {
  useEffect(() => {
    // Log the error to Sentry
    logFatalErrorInSentry(
      new Exception({
        name: "Client500PageDisplayed",
        cause: error,
        context: {
          digest: getErrorDigest(error),
          page: window.location.pathname,
        },
      })
    );
  }, [error]);
}
