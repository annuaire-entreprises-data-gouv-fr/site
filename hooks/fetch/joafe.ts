import { clientJOAFE } from '#clients/open-data-soft/clients/journal-officiel-associations';
import { EAdministration } from '#models/administrations/EAdministration';
import { FetchRessourceException } from '#models/exceptions';
import { IAssociation } from '#models/index';
import { IdRna } from '#utils/helpers';
import logErrorInSentry from '#utils/sentry';
import { useFetchData } from './use-fetch-data';

export const useFetchJOAFE = (uniteLegale: IAssociation) => {
  const idRna = uniteLegale.association.idAssociation as IdRna;

  return useFetchData(
    {
      fetchData: () => clientJOAFE(idRna as IdRna),
      administration: EAdministration.DILA,
      logError: (e: any) => {
        if (e.status === 404) {
          return;
        }
        const exception = new FetchRessourceException({
          ressource: 'JOAFE',
          administration: EAdministration.DILA,
          cause: e,
          context: {
            idRna,
            siren: uniteLegale.siren,
          },
        });
        logErrorInSentry(exception);
      },
    },
    [idRna]
  );
};
