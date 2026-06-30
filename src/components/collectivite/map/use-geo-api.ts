import { useQuery } from "@tanstack/react-query";
import { httpGet } from "#/utils/network";

interface GeoResponse {
  contour: {
    type: "Polygon";
    coordinates: [number, number][][];
  };
}

export function useGeoApi(codeInsee: string) {
  return useQuery({
    queryKey: ["geoApi", codeInsee],
    queryFn: async () =>
      httpGet<GeoResponse>(
        `https://geo.api.gouv.fr/communes/${codeInsee}?fields=code,nom,siren,codesPostaux,departement,region,population,type,epci,surface,centre,contour,mairie,bbox`
      ),
  });
}
