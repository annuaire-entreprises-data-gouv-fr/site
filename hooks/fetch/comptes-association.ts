import { clientDCA } from '#clients/open-data-soft/clients/journal-officiel-associations';
import { EAdministration } from '#models/administrations';
import { FetchRessourceException } from '#models/exceptions';
import { IUniteLegale as IAssociation } from '#models/index';
import { IdRna } from '#utils/helpers';
import logErrorInSentry, { logInfoInSentry } from '#utils/sentry';
import { useFetchData } from './use-fetch-data';

export const useFetchComptesAssociation = (association: IAssociation) => {
  const idRna = association.association.idAssociation as IdRna;
  const siren = association.siren;
  return useFetchData(
    {
      fetchData: () => clientDCA(siren, idRna as IdRna),
      administration: EAdministration.DILA,
      logError: (e: any) => {
        const exception = new FetchRessourceException({
          ressource: 'ComptesAssociation',
          administration: EAdministration.DILA,
          cause: e,
          context: {
            siren,
            idRna,
          },
        });
        if (e.status === 404) {
          logInfoInSentry(exception);
        } else {
          logErrorInSentry(exception);
        }
      },
    },
    [association]
  );
};
