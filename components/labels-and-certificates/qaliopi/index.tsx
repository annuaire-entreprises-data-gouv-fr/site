import FAQLink from '#components-ui/faq-link';
import { MTPEI } from '#components/administrations';
import { Section } from '#components/section';
import { EAdministration } from '#models/administrations';

const FAQQaliopi = () => (
  <FAQLink tooltipLabel="certifiée Qualiopi">
    La certification Qualiopi est accordé par le <MTPEI /> aux organismes de
    formation répondant à certains critères de qualité.
    <br />
    <a href="/faq/qualiopi-organisme-formation">→ En savoir plus</a>
  </FAQLink>
);

export const OrganismeDeFormationSection = () => (
  <Section
    title="Qualiopi - Organisme de formation"
    sources={[EAdministration.MTPEI, EAdministration.DINUM]}
  >
    Cette structure est <FAQQaliopi />. C’est un organisme dont les formations
    peuvent obtenir un financement public.
  </Section>
);
