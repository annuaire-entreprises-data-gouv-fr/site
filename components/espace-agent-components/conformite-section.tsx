import { PrintNever } from '#components-ui/print-visibility';
import { DataSection } from '#components/section/data-section';
import { TwoColumnTable } from '#components/table/simple';
import { IUniteLegale } from '#models/index';
import useFetchConformite from 'hooks/fetch/conformite';
import Conformite from './conformite';

const ConformiteSection: React.FC<{
  uniteLegale: IUniteLegale;
}> = ({ uniteLegale }) => {
  const conformite = useFetchConformite(uniteLegale);

  return (
    <PrintNever>
      <DataSection
        title="Conformité"
        id="conformite"
        isProtected
        data={conformite}
      >
        {(conformite) => (
          <TwoColumnTable
            body={[
              ['Conformité fiscale', <Conformite data={conformite?.fiscale} />],
              [
                'Conformité sociale',
                <>
                  <Conformite
                    data={conformite?.vigilance}
                    administration="Urssaf"
                  />
                  <br />
                  <Conformite data={conformite?.msa} administration="MSA" />
                </>,
              ],
            ]}
          />
        )}
      </DataSection>
    </PrintNever>
  );
};

export default ConformiteSection;
