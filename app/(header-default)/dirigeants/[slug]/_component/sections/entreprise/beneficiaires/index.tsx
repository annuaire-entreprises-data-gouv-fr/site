import ProtectedSectionWithUseCase from '#components/section-with-use-case';
import { EAdministration } from '#models/administrations/EAdministration';
import { IUniteLegale } from '#models/core/types';
import { UseCase } from '#models/user/agent';
import { ApplicationRights } from '#models/user/rights';
import { ISession } from '#models/user/session';
import { InfoAgentRBE } from './info-agent-rbe';
import ProtectedBeneficiairesSection from './protected-beneficiaires-section';
import { WarningRBE } from './warning-rbe';

const BeneficiairesSection: React.FC<{
  uniteLegale: IUniteLegale;
  session: ISession | null;
}> = ({ uniteLegale, session }) => {
  return (
    <ProtectedSectionWithUseCase
      session={session}
      uniteLegale={uniteLegale}
      title="Bénéficiaire(s) effectif(s)"
      id="beneficiaires"
      sources={[EAdministration.INPI]}
      allowedUseCases={[
        UseCase.aidesEntreprises,
        UseCase.marches,
        UseCase.fraude,
      ]}
      requiredRight={ApplicationRights.beneficiaires}
      noRightContent={<WarningRBE />}
      useCaseFormContent={<InfoAgentRBE />}
      WrappedSection={ProtectedBeneficiairesSection}
    />
  );
};

export default BeneficiairesSection;
