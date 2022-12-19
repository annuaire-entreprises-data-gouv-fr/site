import { INSEE } from '#components/administrations';
import { Section } from '#components/section';
import { EAdministration } from '#models/administrations';

export const CertificationESSSection = () => (
  <Section
    title="ESS - Entreprise Sociale et Solidaire"
    sources={[EAdministration.INSEE]}
  >
    Cette structure est enregistrée auprès de l’
    <INSEE /> comme appartenant au champ de{' '}
    <a
      target="_blank"
      rel="noreferrer noopener"
      href="https://www.economie.gouv.fr/cedef/economie-sociale-et-solidaire"
    >
      l’Economie Sociale et Solidaire
    </a>
  </Section>
);
