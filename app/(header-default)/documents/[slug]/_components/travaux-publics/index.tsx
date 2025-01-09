import SectionWithUseCase from '#components/section-with-use-case';
import { EAdministration } from '#models/administrations/EAdministration';
import { IUniteLegale } from '#models/core/types';
import { UseCase } from '#models/user/agent';
import { ApplicationRights, hasRights } from '#models/user/rights';
import { ISession } from '#models/user/session';
import { InfoAgentTravauxPublics } from './info-agent-travaux-publics';
import TravauxPublicsSectionWithUseCase from './travaux-publics-section-with-use-case';

export default function TravauxPublicsSection({
  uniteLegale,
  session,
}: {
  uniteLegale: IUniteLegale;
  session: ISession | null;
}) {
  return (
    <SectionWithUseCase
      session={session}
      uniteLegale={uniteLegale}
      title="Travaux publics"
      id="travaux-publics"
      isProtected
      sources={[
        EAdministration.FNTP,
        EAdministration.CIBTP,
        EAdministration.CNETP,
        EAdministration.PROBTP,
      ]}
      allowedUseCases={[UseCase.aides, UseCase.marches, UseCase.fraude]}
      hasRights={hasRights(session, ApplicationRights.travauxPublics)}
      useCaseFormContent={<InfoAgentTravauxPublics />}
      WrappedSection={TravauxPublicsSectionWithUseCase}
    />
  );
}
