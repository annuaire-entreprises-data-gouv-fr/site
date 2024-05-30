import { clientAnnuaireServicePublicByIds } from '#clients/open-data-soft/clients/annuaire-service-public';
import { EAdministration } from '#models/administrations/EAdministration';
import { IUniteLegale } from '#models/core/types';
import { FetchRessourceException } from '#models/exceptions';
import { IServicePublic } from '#models/service-public';
import logErrorInSentry from '#utils/sentry';
import { useFetchData } from './use-fetch-data';

export function useFetchServicePublicSubServices(
  servicePublic: IServicePublic,
  uniteLegale: IUniteLegale
) {
  return useFetchData(
    {
      fetchData: () =>
        clientAnnuaireServicePublicByIds(servicePublic.subServicesId),
      administration: EAdministration.DILA,
      logError: (e: any) => {
        if (e.status === 404) {
          return;
        }
        const exception = new FetchRessourceException({
          ressource: 'AnnuaireServicePublic',
          administration: EAdministration.DILA,
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
