import ProtectedSectionWithUseCase from "#components/section-with-use-case";
import { EAdministration } from "#models/administrations/EAdministration";
import { ApplicationRights } from "#models/authentication/user/rights";
import type { ISession } from "#models/authentication/user/session";
import type { IUniteLegale } from "#models/core/types";
import { UseCase } from "#models/use-cases";
import { ProtectedConformiteFiscaleSection } from "./protected-conformite-fiscale-section";
import { ProtectedConformiteSocialeSection } from "./protected-conformite-sociale-section";

export const ConformiteSocialeSection = ({
  uniteLegale,
  session,
}: {
  uniteLegale: IUniteLegale;
  session: ISession | null;
}) => (
  <ProtectedSectionWithUseCase
    allowedUseCases={[UseCase.marches, UseCase.aidesPubliques, UseCase.fraude]}
    id="conformite-sociale"
    requiredRight={ApplicationRights.conformiteSociale}
    session={session}
    sources={[EAdministration.URSSAF, EAdministration.MSA]}
    title="Attestations de conformité sociale"
    uniteLegale={uniteLegale}
    WrappedSection={ProtectedConformiteSocialeSection}
  />
);

export const ConformiteFiscaleSection = ({
  uniteLegale,
  session,
}: {
  uniteLegale: IUniteLegale;
  session: ISession | null;
}) => (
  <ProtectedSectionWithUseCase
    allowedUseCases={[UseCase.marches, UseCase.aidesPubliques]}
    id="conformite-fiscale"
    requiredRight={ApplicationRights.conformiteFiscale}
    session={session}
    sources={[EAdministration.DGFIP]}
    title="Attestation de conformité fiscale"
    uniteLegale={uniteLegale}
    WrappedSection={ProtectedConformiteFiscaleSection}
  />
);
