import ProtectedSectionWithUseCase from "#components/section-with-use-case";
import { EAdministration } from "#models/administrations/EAdministration";
import { ApplicationRights } from "#models/authentication/user/rights";
import type { ISession } from "#models/authentication/user/session";
import type { IUniteLegale } from "#models/core/types";
import { UseCase } from "#models/use-cases";
import ProtectedLiensCapitalistiquesSection from "./protected-liens-capitalistiques-section";

const LiensCapitalistiquesSection = ({
  uniteLegale,
  session,
}: {
  uniteLegale: IUniteLegale;
  session: ISession | null;
}) => {
  return (
    <ProtectedSectionWithUseCase
      session={session}
      uniteLegale={uniteLegale}
      title="Liens capitalistiques"
      id="liens-capitalistiques"
      sources={[EAdministration.DGFIP]}
      allowedUseCases={[
        UseCase.fraude,
        UseCase.marches,
        UseCase.aidesPubliques,
      ]}
      requiredRight={ApplicationRights.liensCapitalistiques}
      WrappedSection={ProtectedLiensCapitalistiquesSection}
    />
  );
};
export default LiensCapitalistiquesSection;
