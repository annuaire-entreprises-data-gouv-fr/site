"use client";

import { APIRoutesPaths } from "app/api/data-fetching/routes-paths";
import { useAPIRouteData } from "hooks/fetch/use-API-route-data";
import { useMemo } from "react";
import { AsyncDataSectionClient } from "#components/section/data-section/client";
import { TwoColumnTable } from "#components/table/simple";
import { PrintNever } from "#components-ui/print-visibility";
import type { EAdministration } from "#models/administrations/EAdministration";
import type { ISession } from "#models/authentication/user/session";
import type { IUniteLegale } from "#models/core/types";
import type { UseCase } from "#models/use-cases";
import Conformite from "./conformite";

interface IProps {
  uniteLegale: IUniteLegale;
  session: ISession | null;
  useCase: UseCase;
  title: string;
  id: string;
  sources: EAdministration[];
  isProtected: boolean;
}

function ConformiteSection({
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
      params: { useCase },
    }),
    [useCase]
  );
  const conformite = useAPIRouteData(
    APIRoutesPaths.EspaceAgentConformite,
    uniteLegale.siege.siret,
    session,
    params
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
                <Conformite
                  administration="DGFiP"
                  data={conformite?.fiscale}
                />,
              ],
              [
                "Conformité sociale",
                <>
                  <Conformite
                    administration="URSSAF"
                    data={conformite?.vigilance}
                  />
                  <br />
                  <Conformite administration="MSA" data={conformite?.msa} />
                </>,
              ],
            ]}
          />
        )}
      </AsyncDataSectionClient>
    </PrintNever>
  );
}

export default ConformiteSection;
