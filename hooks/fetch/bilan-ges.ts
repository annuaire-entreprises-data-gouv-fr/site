import { clientBilanGes } from "#clients/api-data-gouv/bilan-ges";
import { EAdministration } from "#models/administrations/EAdministration";
import { IUniteLegale } from "#models/core/types";
import { FetchRessourceException } from "#models/exceptions";
import { verifySiren } from "#utils/helpers";
import logErrorInSentry from "#utils/sentry";
import { useFetchExternalData } from "./use-fetch-data";

export function useFetchBilanGes(uniteLegale: IUniteLegale, page: number = 1) {
  return useFetchExternalData(
    {
      fetchData: () => clientBilanGes(verifySiren(uniteLegale.siren), page),
      administration: EAdministration.ADEME,
      logError: (e: any) => {
        if (e.status === 404) {
          return;
        }
        const exception = new FetchRessourceException({
          ressource: "Bilan GES",
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
