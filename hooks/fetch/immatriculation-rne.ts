import routes from '#clients/routes';
import { EAdministration } from '#models/administrations';
import { IImmatriculationRNE } from '#models/immatriculation';
import { IUniteLegale } from '#models/index';
import { httpGet } from '#utils/network';
import logErrorInSentry from '#utils/sentry';
import { useFetchData } from './use-fetch-data';

export function useFetchImmatriculationRNE(uniteLegale: IUniteLegale) {
  const { siren } = uniteLegale;
  return useFetchData(
    {
      fetchData: () =>
        httpGet<IImmatriculationRNE>(routes.api.rne + '/' + siren),
      administration: EAdministration.INPI,
      logError: (e: any) => {
        logErrorInSentry(e, {
          errorName: 'RNE API error',
          siren,
        });
      },
    },
    [siren]
  );
}
