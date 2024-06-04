import routes from '#clients/routes';
import { EAdministration } from '#models/administrations/EAdministration';
import { IUniteLegale } from '#models/core/types';
import { FetchRessourceException } from '#models/exceptions';
import { IImmatriculationRNE } from '#models/immatriculation';
import { httpGet } from '#utils/network';
import logErrorInSentry from '#utils/sentry';
import { useFetchData } from './use-fetch-data';

export function useFetchRNEImmatriculation(uniteLegale: IUniteLegale) {
  const { siren } = uniteLegale;

  return useFetchData(
    {
      fetchData: () => httpGet<IImmatriculationRNE>(routes.api.rne + siren),
      administration: EAdministration.INPI,
      logError: (e: any) => {
        if (e.status) {
          return;
        }
        logErrorInSentry(
          new FetchRessourceException({
            ressource: 'RNEImmatriculation',
            administration: EAdministration.INPI,
            cause: e,
          })
        );
      },
    },
    [siren]
  );
}

export default useFetchRNEImmatriculation;
