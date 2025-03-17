import { EAdministration } from '#models/administrations/EAdministration';
import {
  APINotRespondingFactory,
  IAPINotRespondingError,
} from '#models/api-not-responding';
import { IDataFetchingState } from '#models/data-fetching';
import {
  FailToFetchError,
  RequestAbortedDuringUnloadException,
} from '#utils/network/frontend';
import { useEffect, useState } from 'react';

type IFetchDataType<T> = {
  fetchData: () => Promise<T>;
  administration: EAdministration;
  logError: (error: any) => void;
};

/**
 * Hook to fetch data from an external public API (i.e. opendatasoft, service-public, etc.)
 * @param fetchOptions : fetch function, administration, logError
 * @param dependencies : Array of dependencies to retrigger the fetch
 * @returns
 */
export function useFetchExternalData<T>(
  { fetchData, administration, logError }: IFetchDataType<T>,
  dependencies: Array<unknown>
) {
  const [response, setResponse] = useState<
    T | IAPINotRespondingError | IDataFetchingState
  >(IDataFetchingState.LOADING);

  useEffect(() => {
    const fetchAndTreatResponse = async () => {
      try {
        setResponse(await fetchData());
      } catch (e: any) {
        if (e instanceof RequestAbortedDuringUnloadException) {
          return;
        }
        if (429 === e.status) {
          if (e.message === 'Agent over rate limits') {
            setResponse(IDataFetchingState.AGENT_OVER_RATE_LIMITS);
          } else {
            setResponse(IDataFetchingState.TOO_MANY_REQUESTS);
          }
          return;
        }
        if (e instanceof FailToFetchError && !e.status) {
          setResponse(IDataFetchingState.CONNECTIVITY_ERROR);
          return;
        }
        if (e.status) {
          setResponse(APINotRespondingFactory(administration, e.status || 500));
          logError(e);
          return;
        }
        // Otherwise, the error comes from the client itself, and it means it's a model error
        setResponse(IDataFetchingState.MODEL_ERROR);
        logError(e);
      }
    };
    fetchAndTreatResponse();
  }, dependencies);
  return response;
}
