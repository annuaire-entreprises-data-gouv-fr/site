import { APILoadingFactory, IAPILoading } from '#models/api-loading';
import { httpGet } from '#utils/network';
import {
  FailToFetchError,
  RequestAbortedDuringUnloadException,
} from '#utils/network/frontend';
import logErrorInSentry from '#utils/sentry';
import { APIPath, RouteResponse } from 'app/api/data-fetching/routes-handlers';
import { useEffect, useState } from 'react';

/**
 * Hook to fetch data from internal API
 * @param route : route to fetch (from {@link APIPath})
 * @param slug : slug parameter for the route
 * @returns {IAPILoading | RouteResponse<T>} - The API loading state or the fetched data
 */
export function useAPIRouteData<T extends APIPath>(
  route: T,
  slug: string
): IAPILoading | RouteResponse<T> {
  const [response, setResponse] = useState<IAPILoading | RouteResponse<T>>(
    APILoadingFactory()
  );

  useEffect(() => {
    const fetchAndTreatResponse = async () => {
      try {
        setResponse(
          await httpGet<RouteResponse<T>>(
            '/api/data-fetching/' + route + '/' + slug
          )
        );
      } catch (e: any) {
        if (e instanceof RequestAbortedDuringUnloadException) {
          return;
        }
        if (!e.status) {
          // Errors that are not already logged server side
          logErrorInSentry(
            new FailToFetchError({
              context: {
                slug: slug,
                page: '/api/data-fetching/' + route,
              },
              cause: e,
            })
          );
        }
        throw e;
      }
    };
    fetchAndTreatResponse();
  }, [slug, route]);
  return response;
}
