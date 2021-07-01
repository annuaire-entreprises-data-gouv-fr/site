import React from 'react';
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
}

const Immatriculations: React.FC<IProps> = ({
  immatriculationRNM,
  immatriculationRNCS,
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
          <ImmatriculationRNCS immatriculation={immatriculationRNCS} />
          <ImmatriculationRNM immatriculation={immatriculationRNM} />
        </>
      )}
    </>
  );
};

export default Immatriculations;
