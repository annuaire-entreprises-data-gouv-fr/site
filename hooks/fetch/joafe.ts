import { clientJOAFE } from '#clients/open-data-soft/clients/journal-officiel-associations';
import { EAdministration } from '#models/administrations';
import { IUniteLegale } from '#models/index';
import { IdRna } from '#utils/helpers';
import logErrorInSentry from '#utils/sentry';
import { useFetchData } from './use-fetch-data';

export const useFetchJOAFE = (uniteLegale: IUniteLegale) => {
  const idRna = uniteLegale.association.idAssociation as IdRna;

  return useFetchData(
    {
      fetchData: () => clientJOAFE(idRna as IdRna),
      administration: EAdministration.DILA,
      logError: (e: any) => {
        logErrorInSentry(e, {
          errorName: 'JOAFE API error',
          details: `RNA : ${idRna}`,
          siren: uniteLegale.siren,
        });
      },
    },
    [idRna]
  );
};
