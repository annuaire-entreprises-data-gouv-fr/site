'use client';

import React from 'react';
import { DataSectionClient } from '#components/section/data-section/client';
import { EAdministration } from '#models/administrations/EAdministration';
import { IAPILoading } from '#models/api-loading';
import { IAPINotRespondingError } from '#models/api-not-responding';
import { IUniteLegale } from '#models/core/types';
import { IImmatriculationRNE } from '#models/immatriculation';
import { DirigeantContent } from './dirigeant-content';

type IProps = {
  immatriculationRNE:
    | IImmatriculationRNE
    | IAPINotRespondingError
    | IAPILoading;
  uniteLegale: IUniteLegale;
};

/**
 * Dirigeants section
 */
const DirigeantsSection: React.FC<IProps> = ({
  immatriculationRNE,
  uniteLegale,
}) => (
  <DataSectionClient
    id="rne-dirigeants"
    title="Dirigeant(s)"
    sources={[EAdministration.INPI]}
    data={immatriculationRNE}
    notFoundInfo={
      <>
        Cette structure n’est pas enregistrée au{' '}
        <strong>Registre National des Entreprises (RNE)</strong>
      </>
    }
  >
    {(immatriculationRNE) => (
      <DirigeantContent
        dirigeants={immatriculationRNE.dirigeants}
        isFallback={immatriculationRNE.metadata.isFallback}
        uniteLegale={uniteLegale}
      />
    )}
  </DataSectionClient>
);

export default DirigeantsSection;
