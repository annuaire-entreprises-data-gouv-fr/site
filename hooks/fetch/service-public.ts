import { EAdministration } from '#models/administrations/EAdministration';
import { IEtablissement, IUniteLegale } from '#models/core/types';
import { FetchRessourceException } from '#models/exceptions';
import {
  getServicePublicByEtablissement,
  getServicePublicByUniteLegale,
} from '#models/service-public';
import logErrorInSentry from '#utils/sentry';
import { useFetchExternalData } from './use-fetch-data';

export function useFetchServicePublic(
  uniteLegale: IUniteLegale,
  etablissement?: IEtablissement
) {
  return useFetchExternalData(
    {
      fetchData: async () => {
        if (etablissement) {
          return await getServicePublicByEtablissement(etablissement);
        } else {
          return await getServicePublicByUniteLegale(uniteLegale);
        }
      },
      administration: EAdministration.DILA,
      logError: (e: any) => {
        logErrorInSentry(
          new FetchRessourceException({
            ressource: 'AnnuaireServicePublic',
            administration: EAdministration.DILA,
            cause: e,
            context: {
              siren: uniteLegale.siren,
            },
          })
        );
      },
    },
    [uniteLegale]
  );
}
