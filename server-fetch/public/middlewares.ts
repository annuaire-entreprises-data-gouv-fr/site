import type { IDataFetchingState } from "#models/data-fetching";
import {
  delayFetcher,
  type Fetcher,
  type IFetcherFactory,
  ignoreBot,
  withErrorHandler,
} from "../middlewares";

class PublicFetcherFactory<Args extends any[], Result>
  implements IFetcherFactory<Args, Result>
{
  constructor(private loader: Fetcher<Args, Result>) {}

  build(): (
    ...args: Args
  ) => Promise<
    Result | Exclude<IDataFetchingState, IDataFetchingState.LOADING>
  > {
    return withErrorHandler(async (...args: Args) => {
      await ignoreBot();
      // Delay the fetcher so that bots fetching HTML pages don't trigger the fetcher
      await delayFetcher(150);

      return this.loader(...args);
    });
  }
}

export const createPublicFetcher = <Args extends any[], Result>(
  loader: Fetcher<Args, Result>
) => new PublicFetcherFactory(loader);
