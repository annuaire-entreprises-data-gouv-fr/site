import clientBodacc from '#clients/open-data-soft/clients/bodacc';
import { EAdministration } from '#models/administrations';
import { FetchRessourceException } from '#models/exceptions';
import { IUniteLegale } from '#models/index';
import { verifySiren } from '#utils/helpers';
import logErrorInSentry, { logInfoInSentry } from '#utils/sentry';
import { useFetchData } from './use-fetch-data';

export function useFetchBODACC(uniteLegale: IUniteLegale) {
  return useFetchData(
    {
      fetchData: () => clientBodacc(verifySiren(uniteLegale.siren)),
      administration: EAdministration.DILA,
      logError: (e: any) => {
        const exception = new FetchRessourceException({
          ressource: 'BODACC',
          administration: EAdministration.DILA,
          cause: e,
          context: {
            siren: uniteLegale.siren,
          },
        });
        if (e.status === 404) {
          logInfoInSentry(exception);
        } else {
          logErrorInSentry(exception);
        }
      },
    },
    [uniteLegale]
  );
}
