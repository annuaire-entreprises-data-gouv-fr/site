import React from 'react';
import { isAPINotResponding } from '../../models/api-not-responding';
import { IJustificatifs } from '../../models/justificatifs';
import ImmatriculationNotFound from '../introuvable/immatriculation';
import ImmatriculationJOAFE from './joafe';
import ImmatriculationRNCS from './rncs';
import ImmatriculationRNM from './rnm';

const Immatriculations: React.FC<IJustificatifs> = ({
  immatriculationRNM,
  immatriculationRNCS,
  immatriculationJOAFE,
  uniteLegale,
}) => {
  const noImmatriculation =
    isAPINotResponding(immatriculationRNM) &&
    isAPINotResponding(immatriculationJOAFE) &&
    isAPINotResponding(immatriculationRNCS) &&
    immatriculationRNCS.errorType === 404 &&
    immatriculationJOAFE.errorType === 404 &&
    immatriculationRNM.errorType === 404;

  return (
    <>
      {noImmatriculation ? (
        <ImmatriculationNotFound />
      ) : (
        <>
          <ImmatriculationJOAFE
            immatriculation={immatriculationJOAFE}
            uniteLegale={uniteLegale}
          />
          <ImmatriculationRNM
            immatriculation={immatriculationRNM}
            uniteLegale={uniteLegale}
          />
          <ImmatriculationRNCS
            immatriculation={immatriculationRNCS}
            uniteLegale={uniteLegale}
          />
        </>
      )}
    </>
  );
};

export default Immatriculations;
