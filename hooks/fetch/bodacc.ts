import clientBodacc from '#clients/open-data-soft/clients/bodacc';
import { EAdministration } from '#models/administrations/EAdministration';
import { IUniteLegale } from '#models/core/types';
import { FetchRessourceException } from '#models/exceptions';
import { verifySiren } from '#utils/helpers';
import logErrorInSentry from '#utils/sentry';
import { useFetchExternalData } from './use-fetch-data';

export function useFetchBODACC(uniteLegale: IUniteLegale) {
  return useFetchExternalData(
    {
      fetchData: () => clientBodacc(verifySiren(uniteLegale.siren)),
      administration: EAdministration.DILA,
      logError: (e: any) => {
        if (e.status === 404) {
          return;
        }
        const exception = new FetchRessourceException({
          ressource: 'BODACC',
          administration: EAdministration.DILA,
          cause: e,
          context: {
            siren: uniteLegale.siren,
          },
        });
        logErrorInSentry(exception);
      },
    },
    [uniteLegale]
  );
}
