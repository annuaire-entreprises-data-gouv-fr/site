import { clientDPO } from "#clients/api-data-gouv/dpo";
import { EAdministration } from "#models/administrations/EAdministration";
import type { IUniteLegale } from "#models/core/types";
import { FetchRessourceException } from "#models/exceptions";
import { verifySiren } from "#utils/helpers";
import logErrorInSentry from "#utils/sentry";
import { useFetchExternalData } from "./use-fetch-data";

export function useFetchDPO(uniteLegale: IUniteLegale) {
  return useFetchExternalData(
    {
      fetchData: () => clientDPO(verifySiren(uniteLegale.siren)),
      administration: EAdministration.CNIL,
      logError: (e: any) => {
        if (e.status === 404) {
          return;
        }
        const exception = new FetchRessourceException({
          ressource: "DigitalProtectionOfficer",
          administration: EAdministration.CNIL,
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
