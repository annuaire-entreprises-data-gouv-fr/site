import routes from '#clients/routes';
import { EAdministration } from '#models/administrations/EAdministration';
import { FetchRessourceException } from '#models/exceptions';
import { Siren } from '#utils/helpers';
import { httpGet } from '#utils/network';
import logErrorInSentry from '#utils/sentry';
import { useFetchData } from './use-fetch-data';

export function useFetchTVA(siren: Siren) {
  return useFetchData(
    {
      fetchData: () => httpGet<{ tva: string | null }>(routes.api.tva + siren),
      administration: EAdministration.VIES,
      logError: (e: any) => {
        if (e.status) {
          // We already log error server side
          return;
        }
        logErrorInSentry(
          new FetchRessourceException({
            ressource: 'VerifyTVAFront',
            administration: EAdministration.VIES,
            cause: e,
          })
        );
      },
    },
    [siren]
  );
}

export default useFetchTVA;
