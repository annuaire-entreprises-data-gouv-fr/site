import { clientDCA } from '#clients/open-data-soft/clients/journal-officiel-associations';
import { EAdministration } from '#models/administrations';
import { IUniteLegale as IAssociation } from '#models/index';
import { IdRna } from '#utils/helpers';
import logErrorInSentry from '#utils/sentry';
import { useFetchData } from './use-fetch-data';

export const useFetchComptesAssociation = (association: IAssociation) => {
  const idRna = association.association.idAssociation as IdRna;
  const siren = association.siren;
  return useFetchData(
    {
      fetchData: () => clientDCA(siren, idRna as IdRna),
      administration: EAdministration.DILA,
      logError: (e: any) => {
        logErrorInSentry(e, {
          errorName: 'error in API JOAFE : COMPTES',
          details: `RNA : ${idRna}`,
          siren: association.siren,
        });
      },
    },
    [association]
  );
};
