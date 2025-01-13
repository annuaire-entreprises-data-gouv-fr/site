import ProtectedSectionWithUseCase from '#components/section-with-use-case';
import { EAdministration } from '#models/administrations/EAdministration';
import { IUniteLegale } from '#models/core/types';
import { UseCase } from '#models/user/agent';
import { ApplicationRights } from '#models/user/rights';
import { ISession } from '#models/user/session';
import ProtectedConformiteSection from './protected-conformite-section';

const ConformiteSection = ({
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
      title="Conformité"
      id="conformite"
      sources={[
        EAdministration.DGFIP,
        EAdministration.URSSAF,
        EAdministration.MSA,
      ]}
      allowedUseCases={[UseCase.marches, UseCase.aides, UseCase.fraude]}
      requiredRight={ApplicationRights.travauxPublics}
      WrappedSection={ProtectedConformiteSection}
    />
  );
};
export default ConformiteSection;
