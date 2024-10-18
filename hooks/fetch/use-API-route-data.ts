import { IDataFetchingState } from '#models/data-fetching';
import { InternalError } from '#models/exceptions';
import { hasRights } from '#models/user/rights';
import { ISession } from '#models/user/session';
import { httpGet } from '#utils/network';
import {
  FailToFetchError,
  RequestAbortedDuringUnloadException,
} from '#utils/network/frontend';
import logErrorInSentry, { logWarningInSentry } from '#utils/sentry';
import { APIRoutesHandlers } from 'app/api/data-fetching/routes-handlers';
import { APIRoutesPaths } from 'app/api/data-fetching/routes-paths';
import { APIRoutesScopes } from 'app/api/data-fetching/routes-scopes';
import { useEffect, useState } from 'react';
import { UnwrapPromise } from 'types';

export type RouteResponse<T> = T extends APIRoutesPaths
  ? UnwrapPromise<ReturnType<(typeof APIRoutesHandlers)[T]>>
  : never;

export type RouteParams<T> = T extends APIRoutesPaths
  ? Parameters<(typeof APIRoutesHandlers)[T]>[1]
  : never;

type Options<T extends APIRoutesPaths> = {
  params?: RouteParams<T>;
};

/**
 * Hook to fetch data from internal API
 * @param route : route to fetch (from {@link APIRoutesPaths})
 * @param slug : slug parameter for the route
 * @param session : user session, used to check rights
 * @param options : options for the fetch. **Important**: the object should be memoized, otherwise the hook will fetch the data at each render
 * @returns {IDataFetchingState | RouteResponse<T>} - The API loading state or the fetched data
 */
export function useAPIRouteData<T extends APIRoutesPaths>(
  route: T,
  slug: string,
  session: ISession | null,
  options?: Options<T>
): RouteResponse<T> | IDataFetchingState {
  const [response, setResponse] = useState<
    IDataFetchingState | RouteResponse<T>
  >(IDataFetchingState.LOADING);

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetchAPIRoute<T>(route, slug, session, options);
      if (response) {
        setResponse(response);
      }
    };
    fetchData();
  }, [slug, route, session, options]);
  return response;
}

async function fetchAPIRoute<T extends APIRoutesPaths>(
  route: T,
  slug: string,
  session: ISession | null,
  options?: Options<T>
): Promise<RouteResponse<T> | IDataFetchingState | undefined> {
  if (!hasRights(session, APIRoutesScopes[route])) {
    return IDataFetchingState.UNAUTHORIZED;
  }

  try {
    return await httpGet<RouteResponse<T>>(
      '/api/data-fetching/' + route + '/' + slug,
      options
    );
  } catch (e: unknown) {
    if (e instanceof RequestAbortedDuringUnloadException) {
      return;
    }
    if (e instanceof FailToFetchError) {
      e.context.slug = slug;
      e.context.page = '/api/data-fetching/' + route;
      if (!e.status || [408, 504, 429, 401].includes(e.status)) {
        logWarningInSentry(e);
        return IDataFetchingState.CONNECTIVITY_ERROR;
      }
      logErrorInSentry(e);
      return IDataFetchingState.MODEL_ERROR;
    }
    logErrorInSentry(
      new InternalError({
        cause: e,
        message: 'Unhandled error',
      })
    );
    return IDataFetchingState.MODEL_ERROR;
  }
}
