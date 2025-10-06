import { DataInpiLinkWithExplanations } from "#components/justificatifs/data-inpi-link";
import { Section } from "#components/section";
import { EAdministration } from "#models/administrations/EAdministration";
import type { ISession } from "#models/authentication/user/session";
import type { IUniteLegale } from "#models/core/types";

export const JustificatifImmatriculationRNE = ({
  uniteLegale,
  session,
}: {
  uniteLegale: IUniteLegale;
  session: ISession | null;
}) => (
  <Section
    id="justificatifs"
    sources={[EAdministration.INPI]}
    title="Justificatif d’immatriculation au RNE"
  >
    <DataInpiLinkWithExplanations session={session} uniteLegale={uniteLegale} />
  </Section>
);
