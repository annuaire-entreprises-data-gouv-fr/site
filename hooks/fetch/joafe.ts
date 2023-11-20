import { clientJOAFE } from '#clients/open-data-soft/clients/journal-officiel-associations';
import { EAdministration } from '#models/administrations';
import { IAssociation } from '#models/index';
import { IdRna } from '#utils/helpers';
import logErrorInSentry from '#utils/sentry';
import { useFetchData } from './use-fetch-data';

export const useFetchJOAFE = (association: IAssociation) => {
  const idRna = association.association.idAssociation as IdRna;

  return useFetchData(
    {
      fetchData: () => clientJOAFE(idRna as IdRna),
      administration: EAdministration.DILA,
      logError: (e: any) => {
        logErrorInSentry(e, {
          errorName: 'JOAFE API error',
          details: `RNA : ${idRna}`,
          siren: association.siren,
        });
      },
    },
    [idRna]
  );
};
