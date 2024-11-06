'use client';

import { HorizontalSeparator } from '#components-ui/horizontal-separator';
import BreakPageForPrint from '#components-ui/print-break-page';
import { IAPINotRespondingError } from '#models/api-not-responding';
import { IUniteLegale } from '#models/core/types';
import { IDataFetchingState } from '#models/data-fetching';
import { IDirigeantsWithMetadata } from '#models/rne/types';
import { ApplicationRights, hasRights } from '#models/user/rights';
import { ISession } from '#models/user/session';
import { APIRoutesPaths } from 'app/api/data-fetching/routes-paths';
import { useAPIRouteData } from 'hooks/fetch/use-API-route-data';
import BeneficiairesSection from './beneficiaires';
import DirigeantsSection from './dirigeants-section';
import DirigeantSummary from './summary';

export type IDirigeantsFetching =
  | IDirigeantsWithMetadata
  | IAPINotRespondingError
  | IDataFetchingState;

export function DirigeantInformation({
  uniteLegale,
  session,
}: {
  uniteLegale: IUniteLegale;
  session: ISession | null;
}) {
  const isProtected = hasRights(session, ApplicationRights.mandatairesRCS);
  const dirigeants = useAPIRouteData(
    isProtected
      ? APIRoutesPaths.EspaceAgentDirigeantsProtected
      : APIRoutesPaths.RneDirigeants,
    uniteLegale.siren,
    session
  );

  return (
    <>
      <DirigeantSummary uniteLegale={uniteLegale} dirigeants={dirigeants} />
      <DirigeantsSection
        uniteLegale={uniteLegale}
        dirigeants={dirigeants}
        isProtected={isProtected}
      />
      <BreakPageForPrint />
      <HorizontalSeparator />
      <BeneficiairesSection uniteLegale={uniteLegale} session={session} />
    </>
  );
}
