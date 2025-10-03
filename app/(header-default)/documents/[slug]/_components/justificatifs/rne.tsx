import { DataInpiLinkWithExplanations } from "#components/justificatifs/data-inpi-link";
import { Section } from "#components/section";
import { EAdministration } from "#models/administrations/EAdministration";
import { ISession } from "#models/authentication/user/session";
import { IUniteLegale } from "#models/core/types";

export const JustificatifImmatriculationRNE = ({
  uniteLegale,
  session,
}: {
  uniteLegale: IUniteLegale;
  session: ISession | null;
}) => (
  <Section
    title="Justificatif d’immatriculation au RNE"
    id="justificatifs"
    sources={[EAdministration.INPI]}
  >
    <DataInpiLinkWithExplanations uniteLegale={uniteLegale} session={session} />
  </Section>
);
