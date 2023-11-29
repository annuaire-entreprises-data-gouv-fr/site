import routes from '#clients/routes';
import { EAdministration } from '#models/administrations';
import { IConformiteUniteLegale } from '#models/espace-agent/donnees-restreintes-entreprise';
import { IUniteLegale } from '#models/index';
import { httpGet } from '#utils/network';
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
    },
    [siret]
  );
}

export default useFetchConformite;
