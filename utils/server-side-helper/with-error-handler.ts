import { convertErrorToFetchingState } from "#utils/helpers/convert-error";
import { handleServerError } from "./handle-server-error";

export function withErrorHandler<T, Args extends any[]>(
  fn: (...args: Args) => Promise<T>
) {
  return async (...args: Args) => {
    try {
      return await fn(...args);
    } catch (error) {
      const formattedError = handleServerError(error);

      return convertErrorToFetchingState(formattedError.status);
    }
  };
}
