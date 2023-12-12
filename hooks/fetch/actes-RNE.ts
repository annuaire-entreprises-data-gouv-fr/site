import routes from '#clients/routes';
import { EAdministration } from '#models/administrations/EAdministration';
import { FetchRessourceException } from '#models/exceptions';
import { IActesRNE } from '#models/immatriculation';
import { IUniteLegale } from '#models/index';
import { httpGet } from '#utils/network';
import logErrorInSentry from '#utils/sentry';
import { useFetchData } from './use-fetch-data';

export function useFetchActesRNE(uniteLegale: IUniteLegale) {
  const { siren } = uniteLegale;
  return useFetchData(
    {
      fetchData: () =>
        httpGet<IActesRNE>(routes.api.rne.documents.list + siren),
      administration: EAdministration.INPI,
      logError: (e: any) => {
        if (e.status) {
          return;
        }
        logErrorInSentry(
          new FetchRessourceException({
            ressource: 'ActesRNE',
            administration: EAdministration.INPI,
            cause: e,
          })
        );
      },
    },
    [siren]
  );
}

export default useFetchActesRNE;
