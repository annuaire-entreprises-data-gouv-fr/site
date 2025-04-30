import { Section } from '#components/section';
import { EAdministration } from '#models/administrations/EAdministration';

export const LabelPatrimoineVivant = () => {
  return (
    <Section
      title="Entreprise du Patrimoine Vivant"
      sources={[EAdministration.MEF]}
      id="patrimoine-vivant"
    >
      <p>
        Cette structure est labellisée{' '}
        <strong>« Entreprise du Patrimoine Vivant »</strong>.
      </p>
      <p>
        Créé en 2005, le label « Entreprise du Patrimoine Vivant » (EPV) est un
        label de l‘État mis en place pour distinguer des entreprises françaises
        artisanales et industrielles aux savoir-faire rares et d‘exception.
      </p>
      <p>
        Décerné par les préfets de région et attribué pour une période de cinq
        ans, le label « Entreprise du Patrimoine Vivant » rassemble{' '}
        <strong>
          des fabricants attachés à la haute performance de leur métier et de
          leurs produits
        </strong>
        .
      </p>
    </Section>
  );
};
