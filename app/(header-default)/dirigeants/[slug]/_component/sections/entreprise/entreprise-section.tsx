import { HorizontalSeparator } from '#components-ui/horizontal-separator';
import BreakPageForPrint from '#components-ui/print-break-page';
import {
  ApplicationRights,
  hasRights,
} from '#models/authentication/user/rights';
import { ISession } from '#models/authentication/user/session';
import { IUniteLegale } from '#models/core/types';
import LiensCapitalistiquesSection from '../../liens-capitalistiques';
import BeneficiairesSection from './beneficiaires';
import DirigeantsSection from './dirigeants-open/section';
import DirigeantsSectionProtected from './dirigeants-protected/section';

export default function DirigeantsEntrepriseSection({
  uniteLegale,
  session,
}: {
  uniteLegale: IUniteLegale;
  session: ISession | null;
}) {
  return (
    <>
      {hasRights(session, ApplicationRights.mandatairesRCS) ? (
        <DirigeantsSectionProtected
          uniteLegale={uniteLegale}
          session={session}
        />
      ) : (
        <DirigeantsSection uniteLegale={uniteLegale} session={session} />
      )}
      <BreakPageForPrint />
      {hasRights(session, ApplicationRights.liensCapitalistiques) && (
        <>
          <HorizontalSeparator />
          <LiensCapitalistiquesSection
            uniteLegale={uniteLegale}
            session={session}
          />
        </>
      )}
      <HorizontalSeparator />
      <BeneficiairesSection uniteLegale={uniteLegale} session={session} />
    </>
  );
}
