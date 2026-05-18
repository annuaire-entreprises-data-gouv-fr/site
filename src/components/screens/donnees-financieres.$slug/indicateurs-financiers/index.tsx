import { useState } from "react";
import type { IAgentInfo } from "#/models/authentication/agent";
import type { IUniteLegale } from "#/models/core/types";
import type { UseCase } from "#/models/use-cases";
import { ProtectedFinancesSocieteSection } from "./finances-societe-protected";
import { PublicFinancesSocieteSection } from "./finances-societe-public";

export function IndicateursFinanciers({
  uniteLegale,
  user,
}: {
  uniteLegale: IUniteLegale;
  user: IAgentInfo | null;
}) {
  const [useCase, setUseCase] = useState<UseCase>();

  return (
    <>
      {useCase ? (
        <ProtectedFinancesSocieteSection
          uniteLegale={uniteLegale}
          useCase={useCase}
          user={user}
        />
      ) : (
        <PublicFinancesSocieteSection
          setUseCase={setUseCase}
          uniteLegale={uniteLegale}
          user={user}
        />
      )}
    </>
  );
}
