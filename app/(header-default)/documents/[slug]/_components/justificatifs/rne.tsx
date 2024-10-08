import { DataInpiLinkWithExplanations } from '#components/justificatifs/data-inpi-link';
import { Section } from '#components/section';
import { EAdministration } from '#models/administrations/EAdministration';
import { IUniteLegale } from '#models/core/types';
import { ISession } from '#models/user/session';

export const JustificatifImmatriculationRNE = ({
  uniteLegale,
  session,
}: {
  uniteLegale: IUniteLegale;
  session: ISession | null;
}) => (
  <Section
    title="Justificatif d’immatriculation au RNE"
    id="justificatif-immatriculation-rne"
    sources={[EAdministration.INPI]}
  >
    <DataInpiLinkWithExplanations uniteLegale={uniteLegale} session={session} />
  </Section>
);
