import React from 'react';
import {
  IAPINotRespondingError,
  isAPINotResponding,
} from '../../models/api-not-responding';
import { IImmatriculation } from '../../models/immatriculation';
import { IJustificatifs } from '../../models/justificatifs';
import AvisSituationSection from './insee';
import ImmatriculationJOAFE from './joafe';
import ImmatriculationRNCS from './rncs';
import ImmatriculationRNM from './rnm';
import ImmatriculationSummary from './summary';
import ImmatriculationNotFoundAlert from '../../components-ui/alerts/immatriculation-not-found-alert';
import { isAssociation } from '../../models';

const isNotFound = (
  immatriculation: IImmatriculation | IAPINotRespondingError
) => {
  return (
    isAPINotResponding(immatriculation) && immatriculation.errorType === 404
  );
};

const Immatriculations: React.FC<IJustificatifs> = ({
  immatriculationRNM,
  immatriculationRNCS,
  immatriculationJOAFE,
  uniteLegale,
}) => {
  const isAnAssociation = isAssociation(uniteLegale);

  const noAssociationImmatriculation =
    !isAnAssociation || (isAnAssociation && isNotFound(immatriculationJOAFE));

  const noRNMImmatriculation = isNotFound(immatriculationRNM);
  const noRNCSImmatriculation = isNotFound(immatriculationRNCS);

  const noImmatriculation =
    noAssociationImmatriculation &&
    noRNCSImmatriculation &&
    noRNMImmatriculation;

  return (
    <>
      <ImmatriculationSummary
        immatriculationRNM={immatriculationRNM}
        immatriculationRNCS={immatriculationRNCS}
        immatriculationJOAFE={immatriculationJOAFE}
        uniteLegale={uniteLegale}
      />
      {noImmatriculation ? (
        <>
          <ImmatriculationNotFoundAlert uniteLegale={uniteLegale} />
          <br />
        </>
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
      <AvisSituationSection uniteLegale={uniteLegale} />
    </>
  );
};

export default Immatriculations;
