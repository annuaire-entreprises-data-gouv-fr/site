import { clientBilansFinanciers } from '#clients/open-data-soft/clients/bilans-financiers';
import { EAdministration } from '#models/administrations';
import { IUniteLegale } from '#models/index';
import logErrorInSentry from '#utils/sentry';
import { useFetchData } from './use-fetch-data';

export function useFetchFinancesSociete(uniteLegale: IUniteLegale) {
  const { siren } = uniteLegale;
  return useFetchData(
    {
      fetchData: () => clientBilansFinanciers(siren),
      administration: EAdministration.MEF,
      logError: (e: any) => {
        logErrorInSentry(e, {
          errorName: 'Error in API data financieres',
          siren,
        });
      },
    },
    [uniteLegale.siren]
  );
}
