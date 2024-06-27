import { clientJOAFE } from '#clients/open-data-soft/clients/journal-officiel-associations';
import { EAdministration } from '#models/administrations/EAdministration';
import { IAssociation } from '#models/core/types';
import { FetchRessourceException } from '#models/exceptions';
import { IdRna } from '#utils/helpers';
import logErrorInSentry from '#utils/sentry';
import { useFetchExternalData } from './use-fetch-data';

export const useFetchJOAFE = (uniteLegale: IAssociation) => {
  const idRna = uniteLegale.association.idAssociation as IdRna;

  return useFetchExternalData(
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
