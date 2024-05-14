'use client';

import { PrintNever } from '#components-ui/print-visibility';
import { DataSectionClient } from '#components/section/data-section/client';
import { TwoColumnTable } from '#components/table/simple';
import { EAdministration } from '#models/administrations/EAdministration';
import { IUniteLegale } from '#models/core/types';
import useFetchConformite from 'hooks/fetch/conformite';
import Conformite from './conformite';

const ConformiteSection: React.FC<{
  uniteLegale: IUniteLegale;
}> = ({ uniteLegale }) => {
  const conformite = useFetchConformite(uniteLegale);

  return (
    <PrintNever>
      <DataSectionClient
        title="Conformité"
        id="conformite"
        isProtected
        data={conformite}
        sources={[
          EAdministration.DGFIP,
          EAdministration.URSSAF,
          EAdministration.MSA,
        ]}
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
      </DataSectionClient>
    </PrintNever>
  );
};

export default ConformiteSection;
