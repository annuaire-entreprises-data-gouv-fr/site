import { headers } from "next/headers";
import { userAgent } from "next/server";
import { HttpUnauthorizedError } from "#clients/exceptions";
import type { IDataFetchingState } from "#models/data-fetching";
import { Exception } from "#models/exceptions";
import { convertErrorToFetchingState } from "#utils/helpers/convert-error";
import { logWarningInSentry } from "#utils/sentry";
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

export async function ignoreBot() {
  const resolvedHeaders = await headers();
  const { isBot } = userAgent({ headers: resolvedHeaders });

  if (isBot) {
    logWarningInSentry(
      new Exception({ name: "UserAgentException", message: "User is a bot" })
    );
    throw new HttpUnauthorizedError("Antibot activated : user is a bot");
  }
}

export async function delayFetcher(timeMs: number) {
  return new Promise((resolve) => setTimeout(resolve, timeMs));
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
