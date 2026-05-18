import ProtectedSectionWithUseCase from "#/components/section-with-use-case";
import { HorizontalSeparator } from "#/components-ui/horizontal-separator";
import { EAdministration } from "#/models/administrations/EAdministration";
import type { IAgentInfo } from "#/models/authentication/agent";
import { ApplicationRights } from "#/models/authentication/user/rights";
import type { IUniteLegale } from "#/models/core/types";
import { UseCase } from "#/models/use-cases";
import { ProtectedLiassesFiscales } from "./protected-liasses-fiscales";

export function LiassesFiscales({
  uniteLegale,
  user,
}: {
  uniteLegale: IUniteLegale;
  user: IAgentInfo | null;
}) {
  return (
    <>
      <HorizontalSeparator />
      <ProtectedSectionWithUseCase
        allowedUseCases={[UseCase.fraude]}
        id="liasses-fiscales"
        requiredRight={ApplicationRights.liassesFiscales}
        sources={[EAdministration.DGFIP]}
        title="Liasses Fiscales"
        uniteLegale={uniteLegale}
        user={user}
        WrappedSection={ProtectedLiassesFiscales}
      />
    </>
  );
}
