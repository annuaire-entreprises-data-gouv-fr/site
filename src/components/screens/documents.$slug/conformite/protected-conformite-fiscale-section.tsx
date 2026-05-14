import { useMemo } from "react";
import { AsyncDataSectionClient } from "#/components/section/data-section/client";
import { TwoColumnTable } from "#/components/table/simple";
import { PrintNever } from "#/components-ui/print-visibility";
import { useServerActionData } from "#/hooks/fetch/use-server-action-data";
import type { EAdministration } from "#/models/administrations/EAdministration";
import type { IAgentInfo } from "#/models/authentication/agent";
import { ApplicationRights } from "#/models/authentication/user/rights";
import type { IUniteLegale } from "#/models/core/types";
import type { UseCase } from "#/models/use-cases";
import { getAgentConformiteFiscaleEntrepriseAction } from "#/server-functions/agent/data-fetching";
import ConformiteFiscale from "./conformite-fiscale";

interface IProps {
  id: string;
  isProtected: boolean;
  sources: EAdministration[];
  title: string;
  uniteLegale: IUniteLegale;
  useCase: UseCase;
  user: IAgentInfo | null;
}

export function ProtectedConformiteFiscaleSection({
  uniteLegale,
  user,
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
    user,
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
        {(data) => (
          <TwoColumnTable
            body={[
              [
                "Conformité fiscale",
                <ConformiteFiscale data={data?.fiscale} />,
              ],
            ]}
          />
        )}
      </AsyncDataSectionClient>
    </PrintNever>
  );
}
