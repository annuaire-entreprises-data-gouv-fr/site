import routes from '#clients/routes';
import { EAdministration } from '#models/administrations/EAdministration';
import { IUniteLegale } from '#models/core/types';
import { ICarteProfessionnelleTravauxPublics } from '#models/espace-agent/carte-professionnelle-travaux-publics';
import { FetchRessourceException } from '#models/exceptions';
import { verifySiren } from '#utils/helpers';
import { httpGet } from '#utils/network';
import logErrorInSentry from '#utils/sentry';
import { useFetchData } from '../use-fetch-data';

export function useFetchCarteProfessionnelle(uniteLegale: IUniteLegale) {
  return useFetchData(
    {
      fetchData: () =>
        httpGet<ICarteProfessionnelleTravauxPublics>(
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
