import FAQLink from '#components-ui/faq-link';
import { INSEE } from '#components/administrations';
import { Section } from '#components/section';
import { EAdministration } from '#models/administrations/EAdministration';

export const CertificationESSSection = () => (
  <Section
    title="ESS - Entreprise Sociale et Solidaire"
    id="ess"
    sources={[EAdministration.INSEE]}
  >
    Cette structure est enregistrée auprès de l’
    <INSEE /> comme appartenant au champ de{' '}
    <FAQLink tooltipLabel="l’Economie Sociale et Solidaire">
      L’Economie Sociale et Solidaire (ESS) regroupe&nbsp;:
      <br />
      <ul>
        <li>Les associations</li>
        <li>Les fondations </li>
        <li>Les coopératives</li>
        <li>Les mutuelles </li>
        <li>Les « entreprises de l’ESS »</li>
      </ul>
      <a href="/definitions/economie-sociale-et-solidaire-ess">
        → En savoir plus
      </a>
    </FAQLink>
    .
  </Section>
);
