import routes from '#clients/routes';
import { EAdministration } from '#models/administrations/EAdministration';
import { IUniteLegale } from '#models/core/types';
import { IOpqibi } from '#models/espace-agent/certificats/opqibi';
import { FetchRessourceException } from '#models/exceptions';
import { verifySiren } from '#utils/helpers';
import { httpGet } from '#utils/network';
import logErrorInSentry from '#utils/sentry';
import { useFetchData } from '../use-fetch-data';

export function useFetchOpqibi(uniteLegale: IUniteLegale) {
  return useFetchData(
    {
      fetchData: () =>
        httpGet<IOpqibi>(
          routes.api.espaceAgent.opqibi + verifySiren(uniteLegale.siren)
        ),
      administration: EAdministration.DINUM,
      logError: (e: any) => {
        const exception = new FetchRessourceException({
          ressource: 'Opqibi',
          administration: EAdministration.DINUM,
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
