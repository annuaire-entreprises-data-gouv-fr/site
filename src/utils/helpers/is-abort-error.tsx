import type { BackendError } from "../network/backend/types";

const isBackendError = (error: any): error is BackendError =>
  error instanceof Error && "isAbort" in error && "isTimeout" in error;

export const isAbortError = (error: any) =>
  (typeof DOMException !== "undefined" &&
    error instanceof DOMException &&
    error.name === "AbortError") ||
  (typeof error === "object" &&
    error !== null &&
    "name" in error &&
    error.name === "AbortError") ||
  (isBackendError(error) && (error.isAbort || error.isTimeout));
