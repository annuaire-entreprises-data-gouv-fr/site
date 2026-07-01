import maplibregl from "maplibre-gl";
import type React from "react";
import { useCallback, useRef } from "react";
import type { IGeoCommune } from "#/clients/api-geo/interface";
import { Section } from "#/components/section";
import { TwoColumnTable } from "#/components/table/simple";
import { EAdministration } from "#/models/administrations/e-administration";
import { formatIntFr, formatNumber } from "#/utils/helpers";
import { CollectiviteMap } from "../map";
import styles from "./styles.module.css";

const formatSurface = (surface: number) =>
  `${(surface / 100).toLocaleString("fr-FR", {
    maximumFractionDigits: 2,
  })} km²`;

export const CollectiviteGeoSection: React.FC<{
  geoCommune: IGeoCommune;
}> = ({ geoCommune }) => {
  const data = [
    ["Nom de la commune", geoCommune.nom],
    ["Code Insee", geoCommune.code],
    ["SIREN de la commune", formatIntFr(geoCommune.siren)],
    ["Code(s) postal(aux)", geoCommune.codesPostaux.join(", ")],
    ["Population", formatNumber(geoCommune.population)],
    ["Superficie", formatSurface(geoCommune.surface)],
    ["Intercommunalité", geoCommune.epci?.nom],
    ["Code EPCI", geoCommune.epci?.code],
    [
      "Département",
      `${geoCommune.departement.nom} (${geoCommune.departement.code})`,
    ],
    ["Région", `${geoCommune.region.nom} (${geoCommune.region.code})`],
  ];

  const mairieMarkerRef = useRef<maplibregl.Marker | null>(null);

  const onMapReady = useCallback(
    (map: maplibregl.Map) => {
      mairieMarkerRef.current?.remove();
      mairieMarkerRef.current = new maplibregl.Marker({ color: "#000091" })
        .setLngLat(geoCommune.mairie.coordinates)
        .setPopup(
          new maplibregl.Popup({ offset: 16 }).setText(
            `Mairie de ${geoCommune.nom}`
          )
        )
        .addTo(map);
    },
    [geoCommune]
  );

  const onMapUnload = useCallback(() => {
    mairieMarkerRef.current?.remove();
    mairieMarkerRef.current = null;
  }, []);

  return (
    <Section
      id="identite"
      sources={[EAdministration.INSEE, EAdministration.DINUM]}
      title={`Identité de la collectivité ${geoCommune.nom}`}
    >
      <CollectiviteMap
        geoCommune={geoCommune}
        onMapReady={onMapReady}
        onMapUnload={onMapUnload}
      />
      <hr className={styles.separator} />
      <TwoColumnTable body={data} />
    </Section>
  );
};
