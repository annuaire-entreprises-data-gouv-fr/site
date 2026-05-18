import { clientAvocats } from "#/clients/api-data-gouv/avocats";
import { EAdministration } from "#/models/administrations/EAdministration";
import type { IUniteLegale } from "#/models/core/types";
import { FetchRessourceException } from "#/models/exceptions";
import { verifySiren } from "#/utils/helpers";
import logErrorInSentry from "#/utils/sentry";
import { useFetchExternalData } from "./use-fetch-data";

export function useFetchAvocats(uniteLegale: IUniteLegale, page = 1) {
  return useFetchExternalData(
    {
      fetchData: () => clientAvocats(verifySiren(uniteLegale.siren), page),
      administration: EAdministration.DINUM,
      logError: (e: any) => {
        if (e.status === 404) {
          return;
        }
        const exception = new FetchRessourceException({
          ressource: "Avocats",
          administration: EAdministration.DINUM,
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
