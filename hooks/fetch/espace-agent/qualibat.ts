import routes from '#clients/routes';
import { EAdministration } from '#models/administrations/EAdministration';
import { IUniteLegale } from '#models/core/types';
import { IQualibat } from '#models/espace-agent/certificats/qualibat';
import { FetchRessourceException } from '#models/exceptions';
import { verifySiret } from '#utils/helpers';
import { httpGet } from '#utils/network';
import logErrorInSentry from '#utils/sentry';
import { useFetchData } from '../use-fetch-data';

export function useFetchQualibat(uniteLegale: IUniteLegale) {
  return useFetchData(
    {
      fetchData: () =>
        httpGet<IQualibat>(
          routes.api.espaceAgent.qualibat + verifySiret(uniteLegale.siege.siret)
        ),
      administration: EAdministration.DINUM,
      logError: (e: any) => {
        const exception = new FetchRessourceException({
          ressource: 'Qualibat',
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
