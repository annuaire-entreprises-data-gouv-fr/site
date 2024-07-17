'use client';

import BreakPageForPrint from '#components-ui/print-break-page';
import AgentWall from '#components/espace-agent-components/agent-wall';
import { IUniteLegale, isAssociation } from '#models/core/types';
import { hasAnyError, isUnauthorized } from '#models/data-fetching';
import { ISession } from '#models/user/session';
import { useAPIRouteData } from 'hooks/fetch/use-API-route-data';
import BeneficiairesSection from './beneficiaires';
import DirigeantsAssociationProtectedSection from './protected-association-dirigeants';
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

  const associationProtected = useAPIRouteData(
    'espace-agent/association-protected',
    uniteLegale.siren,
    session
  );

  const mandatairesRCS = useAPIRouteData(
    'espace-agent/rcs-mandataires',
    uniteLegale.siren,
    session
  );

  return (
    <>
      <DirigeantSummary
        uniteLegale={uniteLegale}
        immatriculationRNE={immatriculationRNE}
      />
      {isAssociation(uniteLegale) &&
        (isUnauthorized(associationProtected) ? (
          <AgentWall
            title="Actes et statuts"
            id="actes"
            uniteLegale={uniteLegale}
          />
        ) : (
          <DirigeantsAssociationProtectedSection
            uniteLegale={uniteLegale}
            associationProtected={associationProtected}
          />
        ))}
      {!isUnauthorized(mandatairesRCS) && !hasAnyError(mandatairesRCS) ? (
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
      <BeneficiairesSection
        immatriculationRNE={immatriculationRNE}
        uniteLegale={uniteLegale}
      />
    </>
  );
}
