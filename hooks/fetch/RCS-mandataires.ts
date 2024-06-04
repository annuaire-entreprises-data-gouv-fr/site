import routes from '#clients/routes';
import { EAdministration } from '#models/administrations/EAdministration';
import { IUniteLegale } from '#models/core/types';
import { FetchRessourceException } from '#models/exceptions';
import { IDirigeant } from '#models/immatriculation';
import { httpGet } from '#utils/network';
import logErrorInSentry from '#utils/sentry';
import { useFetchData } from './use-fetch-data';

export function useFetchRCSMandataires(uniteLegale: IUniteLegale) {
  const { siren } = uniteLegale;

  return useFetchData(
    {
      fetchData: () =>
        httpGet<Array<IDirigeant>>(
          routes.api.espaceAgent.rcsMandataires + siren
        ),
      administration: EAdministration.INFOGREFFE,
      logError: (e: any) => {
        if (e.status) {
          return;
        }
        logErrorInSentry(
          new FetchRessourceException({
            ressource: 'RCSMandataires',
            administration: EAdministration.INFOGREFFE,
            cause: e,
          })
        );
      },
    },
    [siren]
  );
}

export default useFetchRCSMandataires;
