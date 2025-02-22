import ProtectedSectionWithUseCase from '#components/section-with-use-case';
import { EAdministration } from '#models/administrations/EAdministration';
import { ApplicationRights } from '#models/authentication/user/rights';
import { ISession } from '#models/authentication/user/session';
import { IUniteLegale } from '#models/core/types';
import { UseCase } from '#models/use-cases';
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
      title="Attestations de conformité sociale et fiscale"
      id="conformite"
      sources={[
        EAdministration.DGFIP,
        EAdministration.URSSAF,
        EAdministration.MSA,
      ]}
      allowedUseCases={[
        UseCase.marches,
        UseCase.aidesEntreprises,
        UseCase.fraude,
      ]}
      requiredRight={ApplicationRights.conformite}
      WrappedSection={ProtectedConformiteSection}
    />
  );
};
export default ConformiteSection;
