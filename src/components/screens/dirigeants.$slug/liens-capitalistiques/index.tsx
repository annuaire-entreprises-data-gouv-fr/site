import ProtectedSectionWithUseCase from "#/components/section-with-use-case";
import { EAdministration } from "#/models/administrations/EAdministration";
import type { IAgentInfo } from "#/models/authentication/agent";
import { ApplicationRights } from "#/models/authentication/user/rights";
import type { IUniteLegale } from "#/models/core/types";
import { UseCase } from "#/models/use-cases";
import ProtectedLiensCapitalistiquesSection from "./protected-liens-capitalistiques-section";

const LiensCapitalistiquesSection = ({
  uniteLegale,
  user,
}: {
  uniteLegale: IUniteLegale;
  user: IAgentInfo | null;
}) => (
  <ProtectedSectionWithUseCase
    allowedUseCases={[UseCase.fraude, UseCase.marches, UseCase.aidesPubliques]}
    id="liens-capitalistiques"
    requiredRight={ApplicationRights.liensCapitalistiques}
    sources={[EAdministration.DGFIP]}
    title="Liens capitalistiques"
    uniteLegale={uniteLegale}
    user={user}
    WrappedSection={ProtectedLiensCapitalistiquesSection}
  />
);
export default LiensCapitalistiquesSection;
