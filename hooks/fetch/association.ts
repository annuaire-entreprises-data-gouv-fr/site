import routes from '#clients/routes';
import { EAdministration } from '#models/administrations/EAdministration';
import { IDataAssociation } from '#models/association/types';
import { FetchRessourceException } from '#models/exceptions';
import { Siren } from '#utils/helpers';
import { httpGet } from '#utils/network';
import logErrorInSentry from '#utils/sentry';
import { useFetchData } from './use-fetch-data';

export function useFetchAssociation(siren: Siren) {
  return useFetchData(
    {
      fetchData: () =>
        httpGet<IDataAssociation>(routes.api.association + '/' + siren),
      administration: EAdministration.DJEPVA,
      logError: (e: any) => {
        if (e.status) {
          // We already log error server side
          return;
        }
        logErrorInSentry(
          new FetchRessourceException({
            ressource: 'Association',
            administration: EAdministration.DJEPVA,
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
