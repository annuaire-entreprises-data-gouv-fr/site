"use client";

import { useMemo } from "react";
import { getAgentConformiteFiscaleEntrepriseAction } from "server-actions/agent/data-fetching";
import { AsyncDataSectionClient } from "#components/section/data-section/client";
import { TwoColumnTable } from "#components/table/simple";
import { PrintNever } from "#components-ui/print-visibility";
import { useServerActionData } from "#hooks/fetch/use-server-action-data";
import type { EAdministration } from "#models/administrations/EAdministration";
import { ApplicationRights } from "#models/authentication/user/rights";
import type { ISession } from "#models/authentication/user/session";
import type { IUniteLegale } from "#models/core/types";
import type { UseCase } from "#models/use-cases";
import ConformiteFiscale from "./conformite-fiscale";

interface IProps {
  uniteLegale: IUniteLegale;
  session: ISession | null;
  useCase: UseCase;
  title: string;
  id: string;
  sources: EAdministration[];
  isProtected: boolean;
}

export function ProtectedConformiteFiscaleSection({
  uniteLegale,
  session,
  useCase,
  title,
  id,
  sources,
  isProtected,
}: IProps) {
  const params = useMemo(
    () => ({
      siret: uniteLegale.siege.siret,
      useCase,
    }),
    [useCase, uniteLegale.siege.siret]
  );
  const conformite = useServerActionData(
    getAgentConformiteFiscaleEntrepriseAction,
    session,
    params,
    ApplicationRights.conformiteFiscale
  );

  return (
    <PrintNever>
      <AsyncDataSectionClient
        data={conformite}
        id={id}
        isProtected={isProtected}
        sources={sources}
        title={title}
      >
        {(conformite) => (
          <TwoColumnTable
            body={[
              [
                "Conformité fiscale",
                <ConformiteFiscale data={conformite?.fiscale} />,
              ],
            ]}
          />
        )}
      </AsyncDataSectionClient>
    </PrintNever>
  );
}
