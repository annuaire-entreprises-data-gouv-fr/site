import React from 'react';
import AssociationCreationNotFoundAlert from '#components-ui/alerts-with-explanations/association-creation-not-found-alert';
import ImmatriculationRNENotFoundAlert from '#components-ui/alerts-with-explanations/rne-not-found-alert';
import BreakPageForPrint from '#components-ui/print-break-page';
import { isAPILoading } from '#models/api-loading';
import {
  IAPINotRespondingError,
  isAPINotResponding,
} from '#models/api-not-responding';
import {
  IUniteLegale,
  isAssociation,
  isServicePublic,
} from '#models/core/types';
import { IImmatriculation, IImmatriculationRNE } from '#models/immatriculation';
import { IImmatriculationJOAFE } from '#models/immatriculation/joafe';
import { ISession } from '#models/user/session';
import AvisSituationSection from 'app/(header-default)/justificatif/[slug]/_components/insee';
import ImmatriculationJOAFE from 'app/(header-default)/justificatif/[slug]/_components/joafe';
import ImmatriculationSummary from 'app/(header-default)/justificatif/[slug]/_components/summary';
import ImmatriculationRNE from './rne';

const isNotFound = (
  immatriculation: IImmatriculation | IAPINotRespondingError
) => {
  return (
    isAPINotResponding(immatriculation) && immatriculation.errorType === 404
  );
};

export interface IJustificatifs {
  uniteLegale: IUniteLegale;
  immatriculationJOAFE: IImmatriculationJOAFE | IAPINotRespondingError;
  immatriculationRNE: IImmatriculationRNE | IAPINotRespondingError;
}

interface IProps extends IJustificatifs {
  session: ISession | null;
}

export const ImmatriculationsSection: React.FC<IProps> = ({
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
              <ImmatriculationRNENotFoundAlert
                session={session}
                uniteLegale={uniteLegale}
              />
              <br />
            </>
          )}
        </>
      ) : (
        <>
          {isAnAssociation && (
            <ImmatriculationJOAFE immatriculation={immatriculationJOAFE} />
          )}
          {!noRNEImmatriculation && !isServicePublic(uniteLegale) && (
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
