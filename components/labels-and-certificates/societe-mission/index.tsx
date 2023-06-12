import { Section } from '#components/section';
import { EAdministration } from '#models/administrations';

export const CertificationSocieteMission = () => (
  <Section title="Société à mission" sources={[EAdministration.INSEE]}>
    Cette structure est une société à mission.
  </Section>
);
