import { clientBilansFinanciers } from '#clients/open-data-soft/clients/bilans-financiers';
import { EAdministration } from '#models/administrations/EAdministration';
import { IAPINotRespondingError } from '#models/api-not-responding';
import { IUniteLegale } from '#models/core/types';
import { IDataFetchingState } from '#models/data-fetching';
import { FetchRessourceException } from '#models/exceptions';
import { IBilanFinancier } from '#models/finances-societe/types';
import logErrorInSentry from '#utils/sentry';
import { useFetchExternalData } from './use-fetch-data';

export interface IFinancesSociete {
  bilans: IBilanFinancier[];
  hasBilanConsolide: boolean | undefined;
  lastModified: any;
}

export function useFetchFinancesSociete(
  uniteLegale: IUniteLegale
): IFinancesSociete | IAPINotRespondingError | IDataFetchingState {
  const { siren } = uniteLegale;
  return useFetchExternalData(
    {
      fetchData: () => clientBilansFinanciers(siren),
      administration: EAdministration.MEF,
      logError: (e: any) => {
        if (e.status === 404) {
          return;
        }
        const exception = new FetchRessourceException({
          ressource: 'BilansFinanciers',
          administration: EAdministration.MEF,
          cause: e,
          context: {
            siren: uniteLegale.siren,
          },
        });
        logErrorInSentry(exception);
      },
    },
    [uniteLegale.siren]
  );
}
