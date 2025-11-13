import { convertErrorToFetchingState } from "#utils/helpers/convert-error";
import { handleServerError } from "./handle-server-error";

export async function withErrorHandler<T>(fn: () => Promise<T>) {
  try {
    return await fn();
  } catch (error) {
    const formattedError = handleServerError(error);

    return convertErrorToFetchingState(formattedError.status);
  }
}
