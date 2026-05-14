import { useMemo } from "react";
import { AsyncDataSectionClient } from "#/components/section/data-section/client";
import { TwoColumnTable } from "#/components/table/simple";
import { PrintNever } from "#/components-ui/print-visibility";
import { useServerFnData } from "#/hooks/fetch/use-server-fn-data";
import type { EAdministration } from "#/models/administrations/EAdministration";
import { ApplicationRights } from "#/models/authentication/user/rights";
import type { IUniteLegale } from "#/models/core/types";
import type { UseCase } from "#/models/use-cases";
import { getAgentConformiteSocialeEntrepriseFn } from "#/server-functions/agent/data-fetching";
import ConformiteMSA from "./conformite-msa";
import ConformiteVigilance from "./conformite-vigilance";

interface IProps {
  id: string;
  isProtected: boolean;
  sources: EAdministration[];
  title: string;
  uniteLegale: IUniteLegale;
  useCase: UseCase;
}

export function ProtectedConformiteSocialeSection({
  uniteLegale,
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
  const conformite = useServerFnData(
    getAgentConformiteSocialeEntrepriseFn,
    params,
    ApplicationRights.conformiteSociale
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
                "Conformité sociale",
                <>
                  <ConformiteVigilance data={data?.vigilance} />
                  <br />
                  <ConformiteMSA data={data?.msa} />
                </>,
              ],
            ]}
          />
        )}
      </AsyncDataSectionClient>
    </PrintNever>
  );
}
