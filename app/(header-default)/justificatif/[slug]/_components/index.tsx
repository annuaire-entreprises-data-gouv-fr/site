'use client';

import { Loader } from '#components-ui/loader';
import { isAPILoading } from '#models/api-loading';
import { IUniteLegale } from '#models/core/types';
import { ISession } from '#models/user/session';
import { useTimeout } from 'hooks';
import { useAPIRouteData } from 'hooks/fetch/use-API-route-data';
import { IJustificatifs, ImmatriculationsSection } from './container';

const Immatriculations: React.FC<{
  uniteLegale: IUniteLegale;
  immatriculationJOAFE: IJustificatifs['immatriculationJOAFE'];
  session: ISession | null;
}> = ({ uniteLegale, immatriculationJOAFE, session }) => {
  const immatriculationRNE = useAPIRouteData('rne', uniteLegale.siren);
  const after100ms = useTimeout(100);
  return (
    <>
      {isAPILoading(immatriculationRNE) ? (
        after100ms && (
          <>
            Chargement des données en cours <Loader />
          </>
        )
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
