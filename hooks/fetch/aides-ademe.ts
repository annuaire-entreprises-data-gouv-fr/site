import { clientAidesADEME } from "#clients/api-data-gouv/aide-ademe";
import { EAdministration } from "#models/administrations/EAdministration";
import type { IUniteLegale } from "#models/core/types";
import { FetchRessourceException } from "#models/exceptions";
import { verifySiren } from "#utils/helpers";
import logErrorInSentry from "#utils/sentry";
import { useFetchExternalData } from "./use-fetch-data";

export function useFetchAidesADEME(uniteLegale: IUniteLegale, page = 1) {
  return useFetchExternalData(
    {
      fetchData: () => clientAidesADEME(verifySiren(uniteLegale.siren), page),
      administration: EAdministration.ADEME,
      logError: (e: any) => {
        if (e.status === 404) {
          return;
        }
        const exception = new FetchRessourceException({
          ressource: "Aides ADEME",
          administration: EAdministration.ADEME,
          cause: e,
          context: {
            siren: uniteLegale.siren,
          },
        });
        logErrorInSentry(exception);
      },
    },
    [uniteLegale, page]
  );
}
