import ProtectedSectionWithUseCase from "#components/section-with-use-case";
import { EAdministration } from "#models/administrations/EAdministration";
import { ApplicationRights } from "#models/authentication/user/rights";
import type { ISession } from "#models/authentication/user/session";
import type { IUniteLegale } from "#models/core/types";
import { UseCase } from "#models/use-cases";
import ProtectedTravauxPublicsSection from "./protected-travaux-publics-section";

const TravauxPublicsSection = ({
  uniteLegale,
  session,
}: {
  uniteLegale: IUniteLegale;
  session: ISession | null;
}) => (
  <ProtectedSectionWithUseCase
    allowedUseCases={[UseCase.marches, UseCase.aidesPubliques, UseCase.fraude]}
    id="travaux-publics"
    requiredRight={ApplicationRights.travauxPublics}
    session={session}
    sources={[
      EAdministration.FNTP,
      EAdministration.CIBTP,
      EAdministration.CNETP,
      EAdministration.PROBTP,
    ]}
    title="Travaux publics"
    uniteLegale={uniteLegale}
    WrappedSection={ProtectedTravauxPublicsSection}
  />
);
export default TravauxPublicsSection;
