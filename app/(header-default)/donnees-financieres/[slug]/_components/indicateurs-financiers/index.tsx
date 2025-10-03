"use client";

import type { ISession } from "#models/authentication/user/session";
import type { IUniteLegale } from "#models/core/types";
import type { UseCase } from "#models/use-cases";
import { useState } from "react";
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
          uniteLegale={uniteLegale}
          session={session}
          useCase={useCase}
        />
      ) : (
        <PublicFinancesSocieteSection
          uniteLegale={uniteLegale}
          session={session}
          setUseCase={setUseCase}
        />
      )}
    </>
  );
}
