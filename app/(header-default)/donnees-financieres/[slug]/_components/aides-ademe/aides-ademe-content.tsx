"use client";

import { APIRoutesPaths } from "app/api/data-fetching/routes-paths";
import { parseAsInteger, useQueryState } from "nuqs";
import { useMemo } from "react";
import type { IAidesADEME } from "#clients/api-data-gouv/aide-ademe/interface";
import NonRenseigne from "#components/non-renseigne";
import LocalPageCounter from "#components/search-results/results-pagination/local-pagination";
import { AsyncDataSectionClient } from "#components/section/data-section/client";
import { FullTable } from "#components/table/full";
import { useAPIRouteData } from "#hooks/fetch/use-API-route-data";
import { EAdministration } from "#models/administrations/EAdministration";
import type { ISession } from "#models/authentication/user/session";
import type { IUniteLegale } from "#models/core/types";
import { formatCurrency, formatDate } from "#utils/helpers";

export const NoAidesADEME = () => (
  <p>Aucune aide ADEME n’a été retrouvée pour cette structure.</p>
);

const AidesADEMETable = ({
  aidesADEME,
}: {
  aidesADEME: IAidesADEME["aides"];
}) => (
  <FullTable
    body={aidesADEME.map((a) => [
      a.dateConvention ? formatDate(a.dateConvention) : <NonRenseigne />,
      formatCurrency(a.montant),
      a.dispositifAide,
      a.objet,
    ])}
    head={["Date de convention", "Montant", "Dispositif", "Objet"]}
  />
);

export default function AidesADEMEContent({
  uniteLegale,
  session,
}: {
  uniteLegale: IUniteLegale;
  session: ISession | null;
}) {
  const [currentPage, setCurrentPage] = useQueryState(
    "aides-ademe-page",
    parseAsInteger.withDefault(1)
  );

  const options = useMemo(
    () => ({ params: { page: currentPage } }),
    [currentPage]
  );

  const aidesADEME = useAPIRouteData(
    APIRoutesPaths.AidesADEME,
    uniteLegale.siren,
    session,
    options
  );

  return (
    <AsyncDataSectionClient
      data={aidesADEME}
      id="aides-ademe"
      notFoundInfo={<NoAidesADEME />}
      sources={[EAdministration.ADEME]}
      title="Aides ADEME"
    >
      {(aidesADEME) =>
        aidesADEME.aides?.length === 0 ? (
          <NoAidesADEME />
        ) : (
          <>
            <p>
              Un total de {aidesADEME.aides.length} aides ADEME a été déclaré
              pour cette entreprise.
            </p>
            <AidesADEMETable aidesADEME={aidesADEME.aides} />
            {aidesADEME.meta.total > aidesADEME.meta.page_size && (
              <LocalPageCounter
                compact={true}
                currentPage={currentPage}
                onPageChange={setCurrentPage}
                totalPages={Math.ceil(
                  aidesADEME.meta.total / aidesADEME.meta.page_size
                )}
              />
            )}
          </>
        )
      }
    </AsyncDataSectionClient>
  );
}
