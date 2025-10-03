import ProtectedSectionWithUseCase from "#components/section-with-use-case";
import { EAdministration } from "#models/administrations/EAdministration";
import { ApplicationRights } from "#models/authentication/user/rights";
import type { ISession } from "#models/authentication/user/session";
import type { IUniteLegale } from "#models/core/types";
import { UseCase } from "#models/use-cases";
import { InfoAgentRBE } from "./info-agent-rbe";
import ProtectedBeneficiairesSection from "./protected-beneficiaires-section";
import { WarningRBE } from "./warning-rbe";

const BeneficiairesSection: React.FC<{
  uniteLegale: IUniteLegale;
  session: ISession | null;
}> = ({ uniteLegale, session }) => (
  <ProtectedSectionWithUseCase
    allowedUseCases={[UseCase.aidesPubliques, UseCase.marches, UseCase.fraude]}
    id="beneficiaires"
    noRightContent={<WarningRBE />}
    requiredRight={ApplicationRights.beneficiaires}
    session={session}
    sources={[EAdministration.INPI]}
    title="Bénéficiaire(s) effectif(s)"
    uniteLegale={uniteLegale}
    useCaseFormContent={<InfoAgentRBE />}
    WrappedSection={ProtectedBeneficiairesSection}
  />
);

export default BeneficiairesSection;
