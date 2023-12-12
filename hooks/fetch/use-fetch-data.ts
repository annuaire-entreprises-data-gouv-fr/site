import { useEffect, useState } from 'react';
import { EAdministration } from '#models/administrations/EAdministration';
import { APILoadingFactory, IAPILoading } from '#models/api-loading';
import {
  APINotRespondingFactory,
  IAPINotRespondingError,
} from '#models/api-not-responding';
import { RequestAbortedDuringUnloadException } from '#utils/network/frontend';

type IFetchDataType<T> = {
  fetchData: () => Promise<T>;
  administration: EAdministration;
  logError: (error: any) => void;
};

/**
 * Hook to fetch data from an API
 * @param fetchOptions : fetch function, administration, logError
 * @param dependancies : Array of dependancies to retrigger the fetch
 * @returns
 */
export function useFetchData<T extends {}>(
  { fetchData, administration, logError }: IFetchDataType<T>,
  dependancies: Array<unknown>
) {
  const [response, setResponse] = useState<
    T | IAPINotRespondingError | IAPILoading
  >(APILoadingFactory());

  useEffect(() => {
    const fetchAndTreatResponse = async () => {
      try {
        setResponse(await fetchData());
      } catch (e: any) {
        if (e instanceof RequestAbortedDuringUnloadException) {
          return;
        }

        setResponse(APINotRespondingFactory(administration, e.status || 500));
        logError(e);
      }
    };
    fetchAndTreatResponse();
  }, dependancies);
  return response;
}
