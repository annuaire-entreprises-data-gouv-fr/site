import { clientAlimConfiance } from '#clients/api-data-gouv/alim-confiance';
import { EAdministration } from '#models/administrations/EAdministration';
import { IUniteLegale } from '#models/core/types';
import { FetchRessourceException } from '#models/exceptions';
import { verifySiret } from '#utils/helpers';
import logErrorInSentry from '#utils/sentry';
import { useFetchExternalData } from './use-fetch-data';

export function useFetchAlimConfiance(uniteLegale: IUniteLegale) {
  return useFetchExternalData(
    {
      fetchData: () =>
        clientAlimConfiance(verifySiret(uniteLegale.siege.siret)),
      administration: EAdministration.MAA,
      logError: (e: any) => {
        if (e.status === 404) {
          return;
        }
        const exception = new FetchRessourceException({
          ressource: 'Alim Confiance',
          administration: EAdministration.MAA,
          cause: e,
          context: {
            siret: uniteLegale.siege.siret,
          },
        });
        logErrorInSentry(exception);
      },
    },
    [uniteLegale]
  );
}
