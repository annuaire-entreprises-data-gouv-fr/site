import ProtectedSectionWithUseCase from "#/components/section-with-use-case";
import { EAdministration } from "#/models/administrations/EAdministration";
import type { IAgentInfo } from "#/models/authentication/agent";
import { ApplicationRights } from "#/models/authentication/user/rights";
import type { IUniteLegale } from "#/models/core/types";
import { UseCase } from "#/models/use-cases";
import ProtectedTravauxPublicsSection from "./protected-travaux-publics-section";

const TravauxPublicsSection = ({
  uniteLegale,
  user,
}: {
  uniteLegale: IUniteLegale;
  user: IAgentInfo | null;
}) => (
  <ProtectedSectionWithUseCase
    allowedUseCases={[UseCase.marches, UseCase.aidesPubliques, UseCase.fraude]}
    id="travaux-publics"
    requiredRight={ApplicationRights.travauxPublics}
    sources={[
      EAdministration.FNTP,
      EAdministration.CIBTP,
      EAdministration.CNETP,
      EAdministration.PROBTP,
    ]}
    title="Travaux publics"
    uniteLegale={uniteLegale}
    user={user}
    WrappedSection={ProtectedTravauxPublicsSection}
  />
);
export default TravauxPublicsSection;
