import ProtectedSectionWithUseCase from "#/components/section-with-use-case";
import { EAdministration } from "#/models/administrations/EAdministration";
import type { IAgentInfo } from "#/models/authentication/agent";
import { ApplicationRights } from "#/models/authentication/user/rights";
import type { IUniteLegale } from "#/models/core/types";
import { UseCase } from "#/models/use-cases";
import { ProtectedConformiteFiscaleSection } from "./protected-conformite-fiscale-section";
import { ProtectedConformiteSocialeSection } from "./protected-conformite-sociale-section";

export const ConformiteSocialeSection = ({
  uniteLegale,
  user,
}: {
  uniteLegale: IUniteLegale;
  user: IAgentInfo | null;
}) => (
  <ProtectedSectionWithUseCase
    allowedUseCases={[UseCase.marches, UseCase.aidesPubliques, UseCase.fraude]}
    id="conformite-sociale"
    requiredRight={ApplicationRights.conformiteSociale}
    sources={[EAdministration.URSSAF, EAdministration.MSA]}
    title="Attestations de conformité sociale"
    uniteLegale={uniteLegale}
    user={user}
    WrappedSection={ProtectedConformiteSocialeSection}
  />
);

export const ConformiteFiscaleSection = ({
  uniteLegale,
  user,
}: {
  uniteLegale: IUniteLegale;
  user: IAgentInfo | null;
}) => (
  <ProtectedSectionWithUseCase
    allowedUseCases={[UseCase.marches, UseCase.aidesPubliques]}
    id="conformite-fiscale"
    requiredRight={ApplicationRights.conformiteFiscale}
    sources={[EAdministration.DGFIP]}
    title="Attestation de conformité fiscale"
    uniteLegale={uniteLegale}
    user={user}
    WrappedSection={ProtectedConformiteFiscaleSection}
  />
);
