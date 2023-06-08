import FAQLink from '#components-ui/faq-link';
import { INSEE } from '#components/administrations';
import { Section } from '#components/section';
import { EAdministration } from '#models/administrations';

export const CertificationSocieteMission = () => (
  <Section title="Société à mission" sources={[EAdministration.MTPEI]}>
    Cette structure est enregistrée comme société à mission.
  </Section>
);
