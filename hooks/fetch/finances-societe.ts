import { clientBilansFinanciers } from '#clients/open-data-soft/clients/bilans-financiers';
import { EAdministration } from '#models/administrations';
import { FetchRessourceException } from '#models/exceptions';
import { IUniteLegale } from '#models/index';
import logErrorInSentry, { logInfoInSentry } from '#utils/sentry';
import { useFetchData } from './use-fetch-data';

export function useFetchFinancesSociete(uniteLegale: IUniteLegale) {
  const { siren } = uniteLegale;
  return useFetchData(
    {
      fetchData: () => clientBilansFinanciers(siren),
      administration: EAdministration.MEF,
      logError: (e: any) => {
        const exception = new FetchRessourceException({
          ressource: 'BilansFinanciers',
          administration: EAdministration.MEF,
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
    [uniteLegale.siren]
  );
}
