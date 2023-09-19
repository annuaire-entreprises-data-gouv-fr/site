import { useState } from 'react';
import { PrintNever } from '#components-ui/print-visibility';
import { ProtectedSection } from '#components/section/protected-section';
import { TwoColumnTable } from '#components/table/simple';
import {
  IDonneesRestreinteUniteLegale,
} from '#models/espace-agent/donnees-restreintes-entreprise';
import { IUniteLegale } from '#models/index';
import { useDonneesRestreintes } from 'hooks';
import Conformite from './conformite';

const ConformiteSection: React.FC<{
  uniteLegale: IUniteLegale;
}> = ({ uniteLegale }) => {
  const { isLoading, donneesRestreintes } = useDonneesRestreintes(uniteLegale);

  return (
    <PrintNever>
      <ProtectedSection title="Conformité">
        <TwoColumnTable
          body={[
            [
              'Conformité fiscale',
              <Conformite
                isLoading={isLoading}
                data={donneesRestreintes?.conformite?.fiscale}
              />,
            ],
            [
              'Conformité sociale',
              <>
                <Conformite
                  isLoading={isLoading}
                  data={donneesRestreintes?.conformite?.vigilance}
                  administration="Urssaf"
                />
                <br />
                <Conformite
                  isLoading={isLoading}
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
