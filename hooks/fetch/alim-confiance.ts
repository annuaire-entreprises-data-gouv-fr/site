import { clientAlimConfiance } from "#clients/api-data-gouv/alim-confiance";
import { EAdministration } from "#models/administrations/EAdministration";
import { IUniteLegale } from "#models/core/types";
import { FetchRessourceException } from "#models/exceptions";
import { verifySiren } from "#utils/helpers";
import logErrorInSentry from "#utils/sentry";
import { useFetchExternalData } from "./use-fetch-data";

export function useFetchAlimConfiance(
  uniteLegale: IUniteLegale,
  page: number = 1
) {
  return useFetchExternalData(
    {
      fetchData: () =>
        clientAlimConfiance(verifySiren(uniteLegale.siren), page),
      administration: EAdministration.MAA,
      logError: (e: any) => {
        if (e.status === 404) {
          return;
        }
        const exception = new FetchRessourceException({
          ressource: "Alim Confiance",
          administration: EAdministration.MAA,
          cause: e,
          context: {
            siret: uniteLegale.siege.siret,
          },
        });
        logErrorInSentry(exception);
      },
    },
    [uniteLegale, page]
  );
}
