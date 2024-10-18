'use client';

import { HorizontalSeparator } from '#components-ui/horizontal-separator';
import BreakPageForPrint from '#components-ui/print-break-page';
import { IAPINotRespondingError } from '#models/api-not-responding';
import { IUniteLegale } from '#models/core/types';
import {
  IDataFetchingState,
  isDataLoading,
  isDataSuccess,
  isUnauthorized,
} from '#models/data-fetching';
import { IDirigeants } from '#models/rne/types';
import { ISession } from '#models/user/session';
import { APIRoutesPaths } from 'app/api/data-fetching/routes-paths';
import { useAPIRouteData } from 'hooks/fetch/use-API-route-data';
import BeneficiairesSection from './beneficiaires';
import RCSRNEComparison from './rcs-rne-comparison';
import DirigeantsSection from './rne-dirigeants';
import DirigeantSummary from './summary';

export type IDirigeantsFetching =
  | IDirigeants
  | IAPINotRespondingError
  | IDataFetchingState;

function mergeDirigeants(
  dirigeantsRNE: IDirigeantsFetching,
  dirigeantsRCS: IDirigeantsFetching
) {
  if (isUnauthorized(dirigeantsRCS)) {
    return { dirigeants: dirigeantsRNE, isProtected: false };
  } else {
    if (isDataLoading(dirigeantsRCS) || isDataLoading(dirigeantsRNE)) {
      return { dirigeants: IDataFetchingState.LOADING, isProtected: false };
    }
    if (isDataSuccess(dirigeantsRCS)) {
      return { dirigeants: dirigeantsRCS, isProtected: true };
    }
  }
  return { dirigeants: dirigeantsRNE, isProtected: false };
}

export function DirigeantInformation({
  uniteLegale,
  session,
}: {
  uniteLegale: IUniteLegale;
  session: ISession | null;
}) {
  const dirigeantsRNE = useAPIRouteData(
    APIRoutesPaths.RneDirigeants,
    uniteLegale.siren,
    session
  );

  const mandatairesRCS = useAPIRouteData(
    APIRoutesPaths.EspaceAgentRcsMandataires,
    uniteLegale.siren,
    session
  );

  const { dirigeants, isProtected } = mergeDirigeants(
    dirigeantsRNE,
    mandatairesRCS
  );

  return (
    <>
      <DirigeantSummary uniteLegale={uniteLegale} dirigeants={dirigeants} />
      <DirigeantsSection
        uniteLegale={uniteLegale}
        dirigeants={dirigeants}
        isProtected={isProtected}
        warning={
          <RCSRNEComparison
            dirigeantsRCS={mandatairesRCS}
            dirigeantsRNE={dirigeantsRNE}
            uniteLegale={uniteLegale}
          />
        }
      />
      <BreakPageForPrint />
      <HorizontalSeparator />
      <BeneficiairesSection uniteLegale={uniteLegale} session={session} />
    </>
  );
}
