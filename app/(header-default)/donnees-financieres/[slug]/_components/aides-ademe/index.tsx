import { Section } from "#components/section";
import { EAdministration } from "#models/administrations/EAdministration";
import { hasAidesADEME, type IUniteLegale } from "#models/core/types";
import AidesADEMEContent, { NoAidesADEME } from "./aides-ademe-content";

export function AidesADEME({ uniteLegale }: { uniteLegale: IUniteLegale }) {
  if (!hasAidesADEME(uniteLegale)) {
    return (
      <Section
        id="aides-ademe"
        sources={[EAdministration.ADEME]}
        title="Aides ADEME"
      >
        <NoAidesADEME />
      </Section>
    );
  }

  return <AidesADEMEContent uniteLegale={uniteLegale} />;
}
