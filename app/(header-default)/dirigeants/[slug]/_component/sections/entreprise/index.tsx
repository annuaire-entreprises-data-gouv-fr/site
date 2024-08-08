'use client';

import BreakPageForPrint from '#components-ui/print-break-page';
import { IUniteLegale } from '#models/core/types';
import { isDataSuccess } from '#models/data-fetching';
import { ISession } from '#models/user/session';
import { useAPIRouteData } from 'hooks/fetch/use-API-route-data';
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
  const immatriculationRNE = useAPIRouteData('rne', uniteLegale.siren, session);

  const mandatairesRCS = useAPIRouteData(
    'espace-agent/rcs-mandataires',
    uniteLegale.siren,
    session
  );

  const hasMandataireRCS = isDataSuccess(mandatairesRCS);

  return (
    <>
      <DirigeantSummary
        uniteLegale={uniteLegale}
        immatriculationRNE={immatriculationRNE}
      />
      {hasMandataireRCS ? (
        <DirigeantsProtectedSection
          uniteLegale={uniteLegale}
          immatriculationRNE={immatriculationRNE}
          mandatairesRCS={mandatairesRCS}
        />
      ) : (
        <DirigeantsSection
          uniteLegale={uniteLegale}
          immatriculationRNE={immatriculationRNE}
        />
      )}

      <BreakPageForPrint />
      <BeneficiairesSection uniteLegale={uniteLegale} session={session} />
    </>
  );
}
