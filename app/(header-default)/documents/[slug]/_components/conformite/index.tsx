import ProtectedSectionWithUseCase from "#components/section-with-use-case";
import { EAdministration } from "#models/administrations/EAdministration";
import { ApplicationRights } from "#models/authentication/user/rights";
import type { ISession } from "#models/authentication/user/session";
import type { IUniteLegale } from "#models/core/types";
import { UseCase } from "#models/use-cases";
import ProtectedConformiteSection from "./protected-conformite-section";

const ConformiteSection = ({
  uniteLegale,
  session,
}: {
  uniteLegale: IUniteLegale;
  session: ISession | null;
}) => (
  <ProtectedSectionWithUseCase
    allowedUseCases={[UseCase.marches, UseCase.aidesPubliques, UseCase.fraude]}
    id="conformite"
    requiredRight={ApplicationRights.conformite}
    session={session}
    sources={[
      EAdministration.DGFIP,
      EAdministration.URSSAF,
      EAdministration.MSA,
    ]}
    title="Attestations de conformité sociale et fiscale"
    uniteLegale={uniteLegale}
    WrappedSection={ProtectedConformiteSection}
  />
);
export default ConformiteSection;
