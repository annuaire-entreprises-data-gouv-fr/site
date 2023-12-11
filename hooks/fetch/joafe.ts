import { clientJOAFE } from '#clients/open-data-soft/clients/journal-officiel-associations';
import { EAdministration } from '#models/administrations';
import { FetchRessourceException } from '#models/exceptions';
import { IAssociation } from '#models/index';
import { IdRna } from '#utils/helpers';
import logErrorInSentry, { logWarningInSentry } from '#utils/sentry';
import { useFetchData } from './use-fetch-data';

export const useFetchJOAFE = (association: IAssociation) => {
  const idRna = association.association.idAssociation as IdRna;

  return useFetchData(
    {
      fetchData: () => clientJOAFE(idRna as IdRna),
      administration: EAdministration.DILA,
      logError: (e: any) => {
        const exception = new FetchRessourceException({
          ressource: 'JOAFE',
          administration: EAdministration.DILA,
          cause: e,
          context: {
            idRna,
            siren: association.siren,
          },
        });
        if (e.status === 404) {
          logWarningInSentry(exception);
        } else {
          logErrorInSentry(exception);
        }
      },
    },
    [idRna]
  );
};
