import { clientMarchePublic } from "#/clients/open-data-soft/clients/marche-public";
import { EAdministration } from "#/models/administrations/e-administration";
import type { ICollectiviteTerritoriale } from "#/models/core/types";
import { FetchRessourceException } from "#/models/exceptions";
import logErrorInSentry from "#/utils/sentry";
import { useFetchExternalData } from "./use-fetch-data";

export function useFetchMarchePublic(uniteLegale: ICollectiviteTerritoriale) {
  return useFetchExternalData(
    {
      fetchData: async () => await clientMarchePublic(uniteLegale.siren),
      administration: EAdministration.DINUM,
      logError: (e: any) => {
        logErrorInSentry(
          new FetchRessourceException({
            ressource: "MarchePublic",
            administration: EAdministration.DINUM,
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
