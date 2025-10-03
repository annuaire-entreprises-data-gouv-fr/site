import { Section } from "#components/section";
import FAQLink from "#components-ui/faq-link";
import { EAdministration } from "#models/administrations/EAdministration";

export const CertificationSocieteMission = () => (
  <Section
    id="societe-a-mission"
    sources={[EAdministration.INSEE]}
    title="Société à mission"
  >
    Cette structure est une{" "}
    <FAQLink to="/faq/societe-a-mission" tooltipLabel="société à mission">
      Une <strong>société à mission</strong> est une entreprise avec une{" "}
      <strong>raison d’être</strong> intégrant des objectifs sociaux et
      environnementaux.
    </FAQLink>
    .
  </Section>
);
