'use client';

import BreakPageForPrint from '#components-ui/print-break-page';
import { IUniteLegale } from '#models/core/types';
import { EScope, hasRights } from '#models/user/rights';
import { ISession } from '#models/user/session';
import useFetchRNEImmatriculation from 'hooks/fetch/RNE-immatriculation';
import BeneficiairesSection from './beneficiaires';
import DirigeantsProtectedSection from './protected-dirigeants';
import DirigeantsSection from './rne-dirigeants';
import DirigeantSummary from './summary';

export function DirigeantInformation({
  uniteLegale,
  session,
}: {
  uniteLegale: IUniteLegale;
  session: ISession | null;
}) {
  const immatriculationRNE = useFetchRNEImmatriculation(uniteLegale);

  return (
    <>
      <DirigeantSummary
        uniteLegale={uniteLegale}
        immatriculationRNE={immatriculationRNE}
      />
      {!hasRights(session, EScope.mandatairesRCS) ? (
        <DirigeantsSection
          uniteLegale={uniteLegale}
          immatriculationRNE={immatriculationRNE}
        />
      ) : (
        <DirigeantsProtectedSection
          uniteLegale={uniteLegale}
          immatriculationRNE={immatriculationRNE}
        />
      )}

      <BreakPageForPrint />
      <BeneficiairesSection
        immatriculationRNE={immatriculationRNE}
        uniteLegale={uniteLegale}
      />
    </>
  );
}
