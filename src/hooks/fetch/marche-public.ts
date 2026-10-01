import { clientMarchePublic } from "#/clients/open-data-soft/clients/marche-public";
import { EAdministration } from "#/models/administrations/e-administration";
import type { ICollectiviteTerritoriale } from "#/models/core/types";
import { FetchRessourceException } from "#/models/exceptions";
import logErrorInSentry from "#/utils/sentry";
import { useFetchExternalData } from "./use-fetch-data";

export function useFetchMarchePublic(
  uniteLegale: ICollectiviteTerritoriale,
  page = 1
) {
  return useFetchExternalData(
    {
      fetchData: () => clientMarchePublic(uniteLegale.siren, page),
      administration: EAdministration.MEF,
      logError: (e: any) => {
        if (e.status === 404) {
          return;
        }
        logErrorInSentry(
          new FetchRessourceException({
            ressource: "MarchePublic",
            administration: EAdministration.MEF,
            cause: e,
            context: {
              siren: uniteLegale.siren,
              page: `${page}`,
            },
          })
        );
      },
    },
    [uniteLegale, page]
  );
}
