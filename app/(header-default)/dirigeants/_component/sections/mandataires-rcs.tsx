'use client';

import React from 'react';
import { DataSectionServer } from '#components/section/data-section/server';
import { EAdministration } from '#models/administrations/EAdministration';
import { IAPINotRespondingError } from '#models/api-not-responding';
import { IUniteLegale } from '#models/core/types';
import { IDirigeant } from '#models/immatriculation';
import { DirigeantContent } from './dirigeant-content';

type IProps = {
  mandatairesRCS: Array<IDirigeant> | IAPINotRespondingError;
  uniteLegale: IUniteLegale;
};

/**
 * Dirigeants section
 */
const MandatairesRCSSection: React.FC<IProps> = ({
  mandatairesRCS,
  uniteLegale,
}) => (
  <DataSectionServer
    id="rne-dirigeants"
    title="Dirigeant(s)"
    sources={[EAdministration.DINUM]}
    data={mandatairesRCS}
    notFoundInfo={null}
  >
    {(mandatairesRCS) => (
      <DirigeantContent
        dirigeants={mandatairesRCS}
        isFallback={false}
        uniteLegale={uniteLegale}
      />
    )}
  </DataSectionServer>
);

export default MandatairesRCSSection;
