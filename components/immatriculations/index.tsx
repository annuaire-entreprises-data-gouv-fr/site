import React from 'react';
import {
  IAPINotRespondingError,
  isAPINotRespondingError,
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
    isAPINotRespondingError(immatriculationRNM) &&
    isAPINotRespondingError(immatriculationRNCS) &&
    immatriculationRNCS.type === 404 &&
    immatriculationRNM.type === 404;

  return (
    <>
      {noImmatriculation ? (
        <>
          <ImmatriculationRNCS immatriculation={immatriculationRNCS} />
          <ImmatriculationRNM immatriculation={immatriculationRNM} />
        </>
      ) : (
        <ImmatriculationNotFound />
      )}
    </>
  );
};

export default Immatriculations;
