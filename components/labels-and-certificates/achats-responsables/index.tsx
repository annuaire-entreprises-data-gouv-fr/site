import { Tag } from '#components-ui/tag';
import { DataSection } from '#components/section/data-section';
import { EAdministration } from '#models/administrations/EAdministration';

type AchatsResponsablesSectionProps = {
  estAchatsResponsables: boolean;
};

export const AchatsResponsablesSection = ({
  estAchatsResponsables,
}: AchatsResponsablesSectionProps) => {
  return (
    <DataSection
      title="Achats Responsables"
      sources={[EAdministration.MEF]}
      id="achats-responsables"
      data={estAchatsResponsables}
    >
      {(labellise) => (
        <>
          <AchatsResponsablesLabel />
          {labellise && (
            <div className="mt-4">
              <Tag color="success">Labellisé achats responsables</Tag>
            </div>
          )}
        </>
      )}
    </DataSection>
  );
};

const AchatsResponsablesLabel = () => (
  <>
    <p>
      Cette structure est labellisée{' '}
      <strong>« Relations fournisseurs et achats responsables »</strong>
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
  </>
);
