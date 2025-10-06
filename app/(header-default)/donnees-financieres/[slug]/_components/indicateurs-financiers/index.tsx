"use client";

import { useState } from "react";
import type { ISession } from "#models/authentication/user/session";
import type { IUniteLegale } from "#models/core/types";
import type { UseCase } from "#models/use-cases";
import { ProtectedFinancesSocieteSection } from "./finances-societe-protected";
import { PublicFinancesSocieteSection } from "./finances-societe-public";

export function IndicateursFinanciers({
  uniteLegale,
  session,
}: {
  uniteLegale: IUniteLegale;
  session: ISession | null;
}) {
  const [useCase, setUseCase] = useState<UseCase>();

  return (
    <>
      {useCase ? (
        <ProtectedFinancesSocieteSection
          session={session}
          uniteLegale={uniteLegale}
          useCase={useCase}
        />
      ) : (
        <PublicFinancesSocieteSection
          session={session}
          setUseCase={setUseCase}
          uniteLegale={uniteLegale}
        />
      )}
    </>
  );
}
