import type React from "react";
import type { IGeoCommune } from "#/clients/api-geo/interface";
import { Section } from "#/components/section";
import { TwoColumnTable } from "#/components/table/simple";
import { EAdministration } from "#/models/administrations/e-administration";
import { formatIntFr, formatNumber } from "#/utils/helpers";

const formatSurface = (surface: number) =>
  `${(surface / 100).toLocaleString("fr-FR", {
    maximumFractionDigits: 2,
  })} km²`;

export const CollectiviteMarchePublicSection: React.FC<{
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

  return (
    <Section
      id="identite"
      sources={[EAdministration.INSEE, EAdministration.DINUM]}
      title={`Identité de la collectivité ${geoCommune.nom}`}
    >
      <TwoColumnTable body={data} />
    </Section>
  );
};
