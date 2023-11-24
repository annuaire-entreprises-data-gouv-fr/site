import routes from '#clients/routes';
import { EAdministration } from '#models/administrations';
import { IActesRNE } from '#models/immatriculation';
import { IUniteLegale } from '#models/index';
import { httpGet } from '#utils/network';
import { useFetchData } from './use-fetch-data';

export function useFetchActes(uniteLegale: IUniteLegale) {
  const { siren } = uniteLegale;
  return useFetchData(
    {
      fetchData: () => httpGet<IActesRNE>(routes.api.actes.list + siren),
      administration: EAdministration.INPI,
    },
    [siren]
  );
}

export default useFetchActes;
