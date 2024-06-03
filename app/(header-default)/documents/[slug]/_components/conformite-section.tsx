'use client';
import Conformite from '#components/espace-agent-components/conformite';
import { AsyncDataSectionClient } from '#components/section/data-section/client';
import { TwoColumnTable } from '#components/table/simple';
import { EAdministration } from '#models/administrations/EAdministration';
import { IUniteLegale } from '#models/core/types';
import useFetchConformite from 'hooks/fetch/conformite';

function ConformiteSection({ uniteLegale }: { uniteLegale: IUniteLegale }) {
  const conformite = useFetchConformite(uniteLegale);

  return (
    <AsyncDataSectionClient
      title={'Conformité'}
      id={'conformite'}
      isProtected
      sources={[
        EAdministration.DGFIP,
        EAdministration.URSSAF,
        EAdministration.MSA,
      ]}
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
    </AsyncDataSectionClient>
  );
}

export default ConformiteSection;
