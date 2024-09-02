import { useEffect, useState } from 'react';
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
import { APIPath, RouteResponse } from 'app/api/data-fetching/routes-handlers';
import { APIRoutesScopes } from 'app/api/data-fetching/routes-scopes';

type Options = {
  params?: URLSearchParams;
};

/**
 * Hook to fetch data from internal API
 * @param route : route to fetch (from {@link APIPath})
 * @param slug : slug parameter for the route
 * @param session : user session, used to check rights
 * @param options : options for the fetch. **Important**: the object should be memoized, otherwise the hook will fetch the data at each render
 * @returns {IDataFetchingState | RouteResponse<T>} - The API loading state or the fetched data
 */
export function useAPIRouteData<T extends APIPath>(
  route: T,
  slug: string,
  session: ISession | null,
  options?: Options
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

async function fetchAPIRoute<T extends APIPath>(
  route: T,
  slug: string,
  session: ISession | null,
  options?: Options
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
