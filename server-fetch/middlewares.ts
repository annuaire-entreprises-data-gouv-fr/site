import type { IDataFetchingState } from "#models/data-fetching";
import { convertErrorToFetchingState } from "#utils/helpers/convert-error";
import { handleServerError } from "#utils/server-side-helper/handle-server-error";

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

export type Fetcher<Args extends any[], Result> = (
  ...args: Args
) => Promise<Result>;

export interface IFetcherFactory<Args extends any[], Result> {
  build(): (
    ...args: Args
  ) => Promise<
    Result | Exclude<IDataFetchingState, IDataFetchingState.LOADING>
  >;
}
