import { checkLatLng } from "#components/map/check-lat-lng";
import { EAdministration } from "#models/administrations/EAdministration";
import { IEtablissement } from "#models/core/types";
import { FetchRessourceException } from "#models/exceptions";
import { getGeoLoc } from "#models/geo-loc";
import logErrorInSentry from "#utils/sentry";
import { useFetchExternalData } from "./use-fetch-data";

export function useFetchGeoLoc(etablissement: IEtablissement) {
  return useFetchExternalData(
    {
      fetchData: async () => {
        let { latitude, longitude } = etablissement;

        if (!latitude || !longitude) {
          const { lat, long } = await getGeoLoc(etablissement);
          latitude = lat;
          longitude = long;
        }
        const coords = checkLatLng(latitude, longitude);
        return coords;
      },
      administration: EAdministration.DINUM,
      logError: (e: any) => {
        if (e.status === 404) {
          return;
        }
        const exception = new FetchRessourceException({
          ressource: "GeoLoc",
          administration: EAdministration.DINUM,
          cause: e,
          context: {
            siren: etablissement.siren,
          },
        });
        logErrorInSentry(exception);
      },
    },
    [etablissement]
  );
}
