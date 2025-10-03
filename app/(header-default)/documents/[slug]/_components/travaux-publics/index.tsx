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
}) => {
  return (
    <ProtectedSectionWithUseCase
      session={session}
      uniteLegale={uniteLegale}
      title="Travaux publics"
      id="travaux-publics"
      sources={[
        EAdministration.FNTP,
        EAdministration.CIBTP,
        EAdministration.CNETP,
        EAdministration.PROBTP,
      ]}
      allowedUseCases={[
        UseCase.marches,
        UseCase.aidesPubliques,
        UseCase.fraude,
      ]}
      requiredRight={ApplicationRights.travauxPublics}
      WrappedSection={ProtectedTravauxPublicsSection}
    />
  );
};
export default TravauxPublicsSection;
