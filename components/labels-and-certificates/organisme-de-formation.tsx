import { Section } from '#components/section';
import { EAdministration } from '#models/administrations';

export const OrganismeDeFormationSection = () => (
  <Section
    title="Qualiopi - Organisme de formation"
    sources={[EAdministration.METI]}
  >
    Cette structure est certifiée Qualiopi. Cela signifie que c’est un organisme
    qui dispense des formations pouvant obtenir un financement public.
  </Section>
);
