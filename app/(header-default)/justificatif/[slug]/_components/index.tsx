'use client';

import { Loader } from '#components-ui/loader';
import { isAPILoading } from '#models/api-loading';
import { IUniteLegale } from '#models/core/types';
import { ISession } from '#models/user/session';
import useFetchRNEImmatriculation from 'hooks/fetch/RNE-immatriculation copy';
import { IJustificatifs, ImmatriculationsSection } from './container';

const Immatriculations: React.FC<{
  uniteLegale: IUniteLegale;
  immatriculationJOAFE: IJustificatifs['immatriculationJOAFE'];
  session: ISession | null;
}> = ({ uniteLegale, immatriculationJOAFE, session }) => {
  const immatriculationRNE = useFetchRNEImmatriculation(uniteLegale);

  return (
    <>
      {isAPILoading(immatriculationRNE) ? (
        <>
          Chargement des données en cours <Loader />
        </>
      ) : (
        <ImmatriculationsSection
          uniteLegale={uniteLegale}
          immatriculationRNE={immatriculationRNE}
          immatriculationJOAFE={immatriculationJOAFE}
          session={session}
        />
      )}
    </>
  );
};

export default Immatriculations;
