import { clientFiness } from "#clients/api-data-gouv/finess";
import { EAdministration } from "#models/administrations/EAdministration";
import type { IUniteLegale } from "#models/core/types";
import { FetchRessourceException } from "#models/exceptions";
import logErrorInSentry from "#utils/sentry";
import { useFetchExternalData } from "./use-fetch-data";

export function useFetchFiness(uniteLegale: IUniteLegale) {
  return useFetchExternalData(
    {
      fetchData: () => clientFiness(uniteLegale.complements.idFinessJuridiques),
      administration: EAdministration.MSS,
      logError: (e: any) => {
        if (e.status === 404) {
          return;
        }
        const exception = new FetchRessourceException({
          ressource: "Finess",
          administration: EAdministration.MSS,
          cause: e,
          context: {
            siret: uniteLegale.siege.siret,
          },
        });
        logErrorInSentry(exception);
      },
    },
    [uniteLegale]
  );
}
