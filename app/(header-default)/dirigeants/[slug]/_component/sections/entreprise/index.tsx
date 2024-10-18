'use client';

import { HorizontalSeparator } from '#components-ui/horizontal-separator';
import BreakPageForPrint from '#components-ui/print-break-page';
import { IAPINotRespondingError } from '#models/api-not-responding';
import { IUniteLegale } from '#models/core/types';
import { IDataFetchingState } from '#models/data-fetching';
import { IDirigeants } from '#models/rne/types';
import { ISession } from '#models/user/session';
import { useAPIRouteData } from 'hooks/fetch/use-API-route-data';
import BeneficiairesSection from './beneficiaires';
import DirigeantsSection from './rne-dirigeants';
import DirigeantSummary from './summary';

export type IDirigeantsFetching =
  | IDirigeants
  | IAPINotRespondingError
  | IDataFetchingState;

export function DirigeantInformation({
  uniteLegale,
  session,
}: {
  uniteLegale: IUniteLegale;
  session: ISession | null;
}) {
  const dirigeants = useAPIRouteData(
    'espace-agent/rcs-rne-dirigeants',
    uniteLegale.siren,
    session
  );

  return (
    <>
      <DirigeantSummary uniteLegale={uniteLegale} dirigeants={dirigeants} />
      <DirigeantsSection
        uniteLegale={uniteLegale}
        dirigeants={dirigeants}
        warning={
          <></>
          // <RCSRNEComparison
          //   dirigeantsRCS={mandatairesRCS}
          //   dirigeantsRNE={dirigeantsRNE}
          //   uniteLegale={uniteLegale}
          // />
        }
      />
      <BreakPageForPrint />
      <HorizontalSeparator />
      <BeneficiairesSection uniteLegale={uniteLegale} session={session} />
    </>
  );
}
