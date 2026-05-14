import { DataInpiLinkWithExplanations } from "#/components/justificatifs/data-inpi-link";
import { Section } from "#/components/section";
import { EAdministration } from "#/models/administrations/EAdministration";
import type { IAgentInfo } from "#/models/authentication/agent";
import type { IUniteLegale } from "#/models/core/types";

export const JustificatifImmatriculationRNE = ({
  uniteLegale,
  user,
}: {
  uniteLegale: IUniteLegale;
  user: IAgentInfo | null;
}) => (
  <Section
    id="justificatifs"
    sources={[EAdministration.INPI]}
    title="Justificatif d’immatriculation au RNE"
  >
    <DataInpiLinkWithExplanations uniteLegale={uniteLegale} user={user} />
  </Section>
);
