import { PrintNever } from '#components-ui/print-visibility';
import { DataSection } from '#components/section/data-section';
import { FullTable } from '#components/table/full';
import { EAdministration } from '#models/administrations';
import { IUniteLegale } from '#models/index';
import useFetchActes from 'hooks/fetch/actes';

const ActesSection: React.FC<{
  uniteLegale: IUniteLegale;
}> = ({ uniteLegale }) => {
  const actes = useFetchActes(uniteLegale);

  return (
    <PrintNever>
      <DataSection
        title="Actes juridiques et statuts"
        id="actes"
        isProtected
        sources={[EAdministration.INPI]}
        data={actes}
      >
        {(actes) => (
          <FullTable
            head={['Test', 'Ba']}
            body={actes.actes.map((a) => [[a.dateDepot], [a.id]])}
          />
        )}
      </DataSection>
    </PrintNever>
  );
};

export default ActesSection;
