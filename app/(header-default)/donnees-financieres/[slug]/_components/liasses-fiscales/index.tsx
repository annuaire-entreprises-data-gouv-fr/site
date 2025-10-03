"use client";

import { HorizontalSeparator } from "#components-ui/horizontal-separator";
import ProtectedSectionWithUseCase from "#components/section-with-use-case";
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
        session={session}
        uniteLegale={uniteLegale}
        title="Liasses Fiscales"
        id="liasses-fiscales"
        sources={[EAdministration.DGFIP]}
        allowedUseCases={[UseCase.fraude]}
        requiredRight={ApplicationRights.liassesFiscales}
        WrappedSection={ProtectedLiassesFiscales}
      />
    </>
  );
}
