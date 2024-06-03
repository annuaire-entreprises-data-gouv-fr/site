import routes from '#clients/routes';
import { EAdministration } from '#models/administrations/EAdministration';
import { IUniteLegale } from '#models/core/types';
import { ICarteProfessionnelleTravauxPublics } from '#models/espace-agent/carte-professionnelle-travaux-publics';
import { FetchRessourceException } from '#models/exceptions';
import { httpGet } from '#utils/network';
import logErrorInSentry from '#utils/sentry';
import { useFetchData } from './use-fetch-data';

export function useFetchCarteProfessionnelleTP(uniteLegale: IUniteLegale) {
  const {
    siege: { siret },
  } = uniteLegale;
  return useFetchData(
    {
      fetchData: () =>
        httpGet<ICarteProfessionnelleTravauxPublics>(
          routes.api.carteProfessionnelleTravauxPublics + siret
        ),
      administration: EAdministration.FNTP,
      logError: (e: any) => {
        if (e.status) {
          return;
        }
        logErrorInSentry(
          new FetchRessourceException({
            ressource: 'Conformite',
            administration: EAdministration.FNTP,
            cause: e,
          })
        );
      },
    },
    [siret]
  );
}

export default useFetchCarteProfessionnelleTP;
