import React from 'react';
import AssociationCreationNotFoundAlert from '#components-ui/alerts/association-creation-not-found-alert';
import ImmatriculationRNENotFoundAlert from '#components-ui/alerts/rne-not-found-alert';
import BreakPageForPrint from '#components-ui/print-break-page';
import AvisSituationSection from '#components/immatriculations/insee';
import ImmatriculationJOAFE from '#components/immatriculations/joafe';
import ImmatriculationSummary from '#components/immatriculations/summary';
import { isAPILoading } from '#models/api-loading';
import {
  IAPINotRespondingError,
  isAPINotResponding,
} from '#models/api-not-responding';
import { IImmatriculation } from '#models/immatriculation';
import { isAssociation, isServicePublic } from '#models/index';
import { IJustificatifs } from '#models/justificatifs';
import { ISession } from '#utils/session';
import ImmatriculationRNE from './rne';

const isNotFound = (
  immatriculation: IImmatriculation | IAPINotRespondingError
) => {
  return (
    isAPINotResponding(immatriculation) && immatriculation.errorType === 404
  );
};

interface IProps extends IJustificatifs {
  session: ISession | null;
}

const Immatriculations: React.FC<IProps> = ({
  immatriculationJOAFE,
  immatriculationRNE,
  uniteLegale,
  session,
}) => {
  const isAnAssociation = isAssociation(uniteLegale);

  const noAssociationImmatriculation =
    !isAnAssociation || (isAnAssociation && isNotFound(immatriculationJOAFE));

  const noRNEImmatriculation =
    !isAPILoading(immatriculationRNE) && isNotFound(immatriculationRNE);

  const noImmatriculation =
    noAssociationImmatriculation && noRNEImmatriculation;

  return (
    <>
      <ImmatriculationSummary
        immatriculationJOAFE={immatriculationJOAFE}
        immatriculationRNE={immatriculationRNE}
        uniteLegale={uniteLegale}
      />
      {noImmatriculation ? (
        <>
          {isAssociation(uniteLegale) ? (
            <>
              <AssociationCreationNotFoundAlert uniteLegale={uniteLegale} />
              <br />
            </>
          ) : isServicePublic(uniteLegale) ? null : (
            <>
              <ImmatriculationRNENotFoundAlert uniteLegale={uniteLegale} />
              <br />
            </>
          )}
        </>
      ) : (
        <>
          {isAnAssociation && (
            <ImmatriculationJOAFE immatriculation={immatriculationJOAFE} />
          )}
          {!noRNEImmatriculation && (
            <ImmatriculationRNE
              immatriculation={immatriculationRNE}
              uniteLegale={uniteLegale}
            />
          )}
        </>
      )}
      <BreakPageForPrint />
      <AvisSituationSection uniteLegale={uniteLegale} session={session} />
    </>
  );
};

export default Immatriculations;
