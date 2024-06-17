'use client';

import { Loader } from '#components-ui/loader';
import { ClientErrorExplanations } from '#components/error-explanations';
import { IUniteLegale } from '#models/core/types';
import {
  hasFetchError,
  isDataLoading,
  isUnauthorized,
} from '#models/data-fetching';
import { ISession } from '#models/user/session';
import { useTimeout } from 'hooks';
import { useAPIRouteData } from 'hooks/fetch/use-API-route-data';
import { IJustificatifs, ImmatriculationsSection } from './container';

const Immatriculations: React.FC<{
  uniteLegale: IUniteLegale;
  immatriculationJOAFE: IJustificatifs['immatriculationJOAFE'];
  session: ISession | null;
}> = ({ uniteLegale, immatriculationJOAFE, session }) => {
  const immatriculationRNE = useAPIRouteData('rne', uniteLegale.siren, session);
  const after100ms = useTimeout(100);
  if (hasFetchError(immatriculationRNE) || isUnauthorized(immatriculationRNE)) {
    return <ClientErrorExplanations />;
  }
  if (isDataLoading(immatriculationRNE)) {
    return (
      after100ms && (
        <>
          Chargement des données en cours <Loader />
        </>
      )
    );
  }
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
