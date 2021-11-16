import React from 'react';
import { IUniteLegale } from '../../models';
import {
  IAPINotRespondingError,
  isAPINotResponding,
} from '../../models/api-not-responding';
import {
  IImmatriculationRNCS,
  IImmatriculationRNM,
} from '../../models/immatriculation';
import ImmatriculationNotFound from '../introuvable/immatriculation';
import ImmatriculationRNCS from './rncs';
import ImmatriculationRNM from './rnm';

interface IProps {
  immatriculationRNM: IImmatriculationRNM | IAPINotRespondingError;
  immatriculationRNCS: IImmatriculationRNCS | IAPINotRespondingError;
  uniteLegale: IUniteLegale;
}

const Immatriculations: React.FC<IProps> = ({
  immatriculationRNM,
  immatriculationRNCS,
  uniteLegale,
}) => {
  const noImmatriculation =
    isAPINotResponding(immatriculationRNM) &&
    isAPINotResponding(immatriculationRNCS) &&
    immatriculationRNCS.errorType === 404 &&
    immatriculationRNM.errorType === 404;

  return (
    <>
      {noImmatriculation ? (
        <ImmatriculationNotFound />
      ) : (
        <>
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
