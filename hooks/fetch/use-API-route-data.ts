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

/**
 * Hook to fetch data from internal API
 * @param route : route to fetch (from {@link APIPath})
 * @param slug : slug parameter for the route
 * @returns {IDataFetchingState | RouteResponse<T>} - The API loading state or the fetched data
 */
export function useAPIRouteData<T extends APIPath>(
  route: T,
  slug: string,
  session: ISession | null
): RouteResponse<T> | IDataFetchingState {
  const [response, setResponse] = useState<
    IDataFetchingState | RouteResponse<T>
  >(IDataFetchingState.LOADING);

  useEffect(() => {
    if (!hasRights(session, APIRoutesScopes[route])) {
      setResponse(IDataFetchingState.UNAUTHORIZED);
      return;
    }

    const fetchAndTreatResponse = async () => {
      try {
        setResponse(
          await httpGet<RouteResponse<T>>(
            '/api/data-fetching/' + route + '/' + slug
          )
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
            setResponse(IDataFetchingState.CONNECTIVITY_ERROR);
            return;
          }
          logErrorInSentry(e);
          setResponse(IDataFetchingState.MODEL_ERROR);
          return;
        }
        logErrorInSentry(
          new InternalError({
            cause: e,
            message: "Ce type d'erreur n'est pas géré",
          })
        );
        setResponse(IDataFetchingState.MODEL_ERROR);
      }
    };

    fetchAndTreatResponse();
  }, [slug, route, session]);
  return response;
}
