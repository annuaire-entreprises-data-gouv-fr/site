import ProtectedSectionWithUseCase from '#components/section-with-use-case';
import { EAdministration } from '#models/administrations/EAdministration';
import { IUniteLegale } from '#models/core/types';
import { UseCase } from '#models/user/agent';
import { ApplicationRights } from '#models/user/rights';
import { ISession } from '#models/user/session';
import ProtectedTravauxPublicsSection from './protected-travaux-publics-section';

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
        UseCase.aidesEntreprises,
        UseCase.fraude,
      ]}
      requiredRight={ApplicationRights.travauxPublics}
      WrappedSection={ProtectedTravauxPublicsSection}
    />
  );
};
export default TravauxPublicsSection;
