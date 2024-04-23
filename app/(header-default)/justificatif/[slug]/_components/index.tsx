'use client';

import { IUniteLegale } from '#models/core/types';
import { ISession } from '#models/user/session';
import { useFetchImmatriculationRNE } from 'hooks';
import { IJustificatifs, ImmatriculationsSection } from './container';

const Immatriculations: React.FC<{
  uniteLegale: IUniteLegale;
  immatriculationJOAFE: IJustificatifs['immatriculationJOAFE'];
  session: ISession | null;
}> = ({ uniteLegale, immatriculationJOAFE, session }) => {
  const immatriculationRNE = useFetchImmatriculationRNE(uniteLegale);

  return (
    <ImmatriculationsSection
      uniteLegale={uniteLegale}
      immatriculationRNE={immatriculationRNE}
      immatriculationJOAFE={immatriculationJOAFE}
      session={session}
    />
  );
};

export default Immatriculations;
