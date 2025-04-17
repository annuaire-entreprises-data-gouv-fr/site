import { Section } from '#components/section';
import { EAdministration } from '#models/administrations/EAdministration';

export const LabelAchatsResponsables = () => {
  return (
    <Section
      title="Achats Responsables"
      sources={[EAdministration.MEF]}
      id="achats-responsables"
    >
      <p>
        Cette structure est labellisée{' '}
        <strong>« Relations fournisseurs et achats responsables »</strong>.
      </p>
      <p>
        Ce label, porté par le Médiateur des entreprises en partenariat avec le
        Conseil National des Achats, distingue les entités{' '}
        <strong>
          ayant fait la preuve de relations durables et équilibrées avec leurs
          fournisseurs
        </strong>
        .
      </p>
      <p>
        Il atteste notamment de la mise en œuvre des engagements de la charte «
        Relations fournisseurs responsables » et de la norme internationale{' '}
        <strong>ISO 20400</strong> sur les achats responsables.
      </p>
    </Section>
  );
};
