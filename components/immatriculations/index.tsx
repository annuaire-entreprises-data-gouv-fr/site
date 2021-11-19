import React from 'react';
import {
  IAPINotRespondingError,
  isAPINotResponding,
} from '../../models/api-not-responding';
import { IImmatriculation } from '../../models/immatriculation';
import { IJustificatifs } from '../../models/justificatifs';
import AssociationCreationNotFound from '../introuvable/association-creation';
import ImmatriculationNotFound from '../introuvable/immatriculation';
import AvisSituationSection from './insee';
import ImmatriculationJOAFE from './joafe';
import ImmatriculationRNCS from './rncs';
import ImmatriculationRNM from './rnm';
import ImmatriculationSummary from './summary';

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
  const noAssociationImmatriculation =
    uniteLegale.association && isNotFound(immatriculationJOAFE);
  const noRNMImmatriculation = isNotFound(immatriculationRNM);
  const noRNCSImmatriculation = isNotFound(immatriculationRNCS);

  const noEntrepriseImmatriculation =
    !noAssociationImmatriculation &&
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
      {noAssociationImmatriculation ? (
        <>
          <AssociationCreationNotFound uniteLegale={uniteLegale} />
          <br />
        </>
      ) : (
        <ImmatriculationJOAFE
          immatriculation={immatriculationJOAFE}
          uniteLegale={uniteLegale}
        />
      )}
      {noEntrepriseImmatriculation ? (
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
      <AvisSituationSection uniteLegale={uniteLegale} />
    </>
  );
};

export default Immatriculations;
