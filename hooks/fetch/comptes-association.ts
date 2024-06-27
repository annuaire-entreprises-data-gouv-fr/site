import { clientDCA } from '#clients/open-data-soft/clients/journal-officiel-associations';
import { EAdministration } from '#models/administrations/EAdministration';
import { IUniteLegale as IAssociation } from '#models/core/types';
import { FetchRessourceException } from '#models/exceptions';
import { IdRna } from '#utils/helpers';
import logErrorInSentry from '#utils/sentry';
import { useFetchExternalData } from './use-fetch-data';

export const useFetchComptesAssociation = (uniteLegale: IAssociation) => {
  const idRna = uniteLegale.association.idAssociation as IdRna;
  const siren = uniteLegale.siren;
  return useFetchExternalData(
    {
      fetchData: () => clientDCA(siren, idRna as IdRna),
      administration: EAdministration.DILA,
      logError: (e: any) => {
        if (e.status === 404) {
          return;
        }
        const exception = new FetchRessourceException({
          ressource: 'ComptesAssociation',
          administration: EAdministration.DILA,
          cause: e,
          context: {
            siren,
            idRna,
          },
        });
        logErrorInSentry(exception);
      },
    },
    [uniteLegale]
  );
};
