import { Section } from "#components/section";
import { EAdministration } from "#models/administrations/EAdministration";
import type { ISession } from "#models/authentication/user/session";
import { hasAidesADEME, type IUniteLegale } from "#models/core/types";
import AidesADEMEContent, { NoAidesADEME } from "./aides-ademe-content";

export function AidesADEME({
  uniteLegale,
  session,
}: {
  uniteLegale: IUniteLegale;
  session: ISession | null;
}) {
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

  return <AidesADEMEContent session={session} uniteLegale={uniteLegale} />;
}
