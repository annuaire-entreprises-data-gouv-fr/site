import { PrintNever } from '#components-ui/print-visibility';
import { ProtectedSection } from '#components/section/protected-section';
import { TwoColumnTable } from '#components/table/simple';
import { IUniteLegale } from '#models/index';
import { useFetchDonneesRestreintes } from 'hooks';
import Conformite from './conformite';

const ConformiteSection: React.FC<{
  uniteLegale: IUniteLegale;
}> = ({ uniteLegale }) => {
  const { donneesRestreintes } = useFetchDonneesRestreintes(uniteLegale);

  return (
    <PrintNever>
      <ProtectedSection title="Conformité">
        <TwoColumnTable
          body={[
            [
              'Conformité fiscale',
              <Conformite data={donneesRestreintes?.conformite?.fiscale} />,
            ],
            [
              'Conformité sociale',
              <>
                <Conformite
                  data={donneesRestreintes?.conformite?.vigilance}
                  administration="Urssaf"
                />
                <br />
                <Conformite
                  data={donneesRestreintes?.conformite?.msa}
                  administration="MSA"
                />
              </>,
            ],
          ]}
        />
      </ProtectedSection>
    </PrintNever>
  );
};

export default ConformiteSection;
