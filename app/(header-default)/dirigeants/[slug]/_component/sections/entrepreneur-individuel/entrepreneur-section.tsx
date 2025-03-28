import { HorizontalSeparator } from '#components-ui/horizontal-separator';
import {
  ApplicationRights,
  hasRights,
} from '#models/authentication/user/rights';
import { ISession } from '#models/authentication/user/session';
import { IUniteLegale } from '#models/core/types';
import BeneficiairesSection from '../entreprise/beneficiaires';
import DirigeantsSection from '../entreprise/dirigeants-open/section';
import DirigeantsSectionProtected from '../entreprise/dirigeants-protected/section';

export default function DirigeantsEntrepreneurIndividuelSection({
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
      <HorizontalSeparator />
      <BeneficiairesSection uniteLegale={uniteLegale} session={session} />
    </>
  );
}
