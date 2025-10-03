"use client";

import ProtectedSectionWithUseCase from "#components/section-with-use-case";
import { HorizontalSeparator } from "#components-ui/horizontal-separator";
import { EAdministration } from "#models/administrations/EAdministration";
import { ApplicationRights } from "#models/authentication/user/rights";
import type { ISession } from "#models/authentication/user/session";
import type { IUniteLegale } from "#models/core/types";
import { UseCase } from "#models/use-cases";
import { ProtectedLiassesFiscales } from "./protected-liasses-fiscales";

export function LiassesFiscales({
  uniteLegale,
  session,
}: {
  uniteLegale: IUniteLegale;
  session: ISession | null;
}) {
  return (
    <>
      <HorizontalSeparator />
      <ProtectedSectionWithUseCase
        allowedUseCases={[UseCase.fraude]}
        id="liasses-fiscales"
        requiredRight={ApplicationRights.liassesFiscales}
        session={session}
        sources={[EAdministration.DGFIP]}
        title="Liasses Fiscales"
        uniteLegale={uniteLegale}
        WrappedSection={ProtectedLiassesFiscales}
      />
    </>
  );
}
