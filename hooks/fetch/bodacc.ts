import clientBodacc from '#clients/open-data-soft/clients/bodacc';
import { EAdministration } from '#models/administrations';
import { IUniteLegale } from '#models/index';
import { verifySiren } from '#utils/helpers';
import logErrorInSentry from '#utils/sentry';
import { useFetchData } from './use-fetch-data';

export function useFetchBODACC(uniteLegale: IUniteLegale) {
  return useFetchData(
    {
      fetchData: () => clientBodacc(verifySiren(uniteLegale.siren)),
      administration: EAdministration.DILA,
      logError: (e: any) => {
        logErrorInSentry(e, {
          siren: uniteLegale.siren,
          errorName: 'Error in API Bodacc',
        });
      },
    },
    [uniteLegale]
  );
}
