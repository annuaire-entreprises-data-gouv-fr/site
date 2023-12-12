import routes from '#clients/routes';
import { EAdministration } from '#models/administrations/EAdministration';
import { FetchRessourceException } from '#models/exceptions';
import { IImmatriculationRNE } from '#models/immatriculation';
import { IUniteLegale } from '#models/index';
import { httpGet } from '#utils/network';
import logErrorInSentry from '#utils/sentry';
import { useFetchData } from './use-fetch-data';

export function useFetchImmatriculationRNE(uniteLegale: IUniteLegale) {
  const { siren } = uniteLegale;
  return useFetchData(
    {
      fetchData: () =>
        httpGet<IImmatriculationRNE>(
          routes.api.rne.immatriculation + '/' + siren
        ),

      administration: EAdministration.INPI,
      logError: (e: any) => {
        if (e.status) {
          // We already log error server side
          return;
        }
        logErrorInSentry(
          new FetchRessourceException({
            ressource: 'ImmatriculationRNE',
            administration: EAdministration.INPI,
            cause: e,
            context: {
              siren,
            },
          })
        );
      },
    },
    [siren]
  );
}
