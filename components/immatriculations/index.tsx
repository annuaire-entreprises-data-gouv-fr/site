import React from 'react';
import ImmatriculationNotFoundAlert from '#components-ui/alerts/immatriculation-not-found-alert';
import AvisSituationSection from '#components/immatriculations/insee';
import ImmatriculationJOAFE from '#components/immatriculations/joafe';
import ImmatriculationRNCS from '#components/immatriculations/rncs';
import ImmatriculationRNM from '#components/immatriculations/rnm';
import ImmatriculationSummary from '#components/immatriculations/summary';
import {
  IAPINotRespondingError,
  isAPINotResponding,
} from '#models/api-not-responding';
import { IImmatriculation } from '#models/immatriculation';
import { isAssociation } from '#models/index';
import { IJustificatifs } from '#models/justificatifs';
import ImmatriculationRNE from './rne';

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
  immatriculationRNE,
  uniteLegale,
}) => {
  const isAnAssociation = isAssociation(uniteLegale);

  const noAssociationImmatriculation =
    !isAnAssociation || (isAnAssociation && isNotFound(immatriculationJOAFE));

  const noRNMImmatriculation = isNotFound(immatriculationRNM);
  const noRNCSImmatriculation = isNotFound(immatriculationRNCS);
  const noRNEImmatriculation = isNotFound(immatriculationRNE);

  const noImmatriculation =
    noAssociationImmatriculation &&
    noRNCSImmatriculation &&
    noRNEImmatriculation &&
    noRNMImmatriculation;

  return (
    <>
      <ImmatriculationSummary
        immatriculationRNM={immatriculationRNM}
        immatriculationRNCS={immatriculationRNCS}
        immatriculationJOAFE={immatriculationJOAFE}
        immatriculationRNE={immatriculationRNE}
        uniteLegale={uniteLegale}
      />
      {noImmatriculation ? (
        <>
          <ImmatriculationNotFoundAlert uniteLegale={uniteLegale} />
          <br />
        </>
      ) : (
        <>
          {isAnAssociation && (
            <ImmatriculationJOAFE immatriculation={immatriculationJOAFE} />
          )}
          <ImmatriculationRNE
            immatriculation={immatriculationRNE}
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
