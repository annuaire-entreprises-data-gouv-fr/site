import routes from '#clients/routes';
import { EAdministration } from '#models/administrations/EAdministration';
import { IConformiteUniteLegale } from '#models/espace-agent/donnees-restreintes-entreprise';
import { FetchRessourceException } from '#models/exceptions';
import { IUniteLegale } from '#models/index';
import { httpGet } from '#utils/network';
import logErrorInSentry from '#utils/sentry';
import { useFetchData } from './use-fetch-data';

export function useFetchConformite(uniteLegale: IUniteLegale) {
  const {
    siege: { siret },
  } = uniteLegale;
  return useFetchData(
    {
      fetchData: () =>
        httpGet<IConformiteUniteLegale>(routes.api.conformite + '/' + siret),
      administration: EAdministration.DINUM,
      logError: (e: any) => {
        if (e.status) {
          return;
        }
        logErrorInSentry(
          new FetchRessourceException({
            ressource: 'Conformite',
            administration: EAdministration.DINUM,
            cause: e,
          })
        );
      },
    },
    [siret]
  );
}

export default useFetchConformite;
