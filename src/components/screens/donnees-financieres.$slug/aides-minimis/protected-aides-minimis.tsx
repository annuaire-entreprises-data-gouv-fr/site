import { getRouteApi } from "@tanstack/react-router";
import { useCallback, useMemo } from "react";
import type { IMinimis } from "#/clients/api-data-gouv/minimis/interface";
import LocalPageCounter from "#/components/search-results/results-pagination/local-pagination";
import { AsyncDataSectionClient } from "#/components/section/data-section/client";
import { FullTable } from "#/components/table/full";
import { useServerActionData } from "#/hooks/fetch/use-server-action-data";
import { EAdministration } from "#/models/administrations/EAdministration";
import type { IAgentInfo } from "#/models/authentication/agent";
import type { IUniteLegale } from "#/models/core/types";
import { getAgentAidesMinimisAction } from "#/server-functions/agent/data-fetching";
import { formatCurrency, formatDate } from "#/utils/helpers";

const NoAidesMinimis = () => (
  <>
    <MinimisDescription />
    <p>Aucune aide Minimis n’a été déclarée pour cette entreprise.</p>
  </>
);

const MinimisDescription = () => (
  <p>
    Le jeu de données Registre-de-minimis répertorie les données contenues dans
    la Plateforme aides d'Etat, relatives aux aides de minimis octroyées après
    le 01/01/2026 pour les secteurs général, SIEG et pêche aquaculture, et après
    le 01/01/2027 pour le secteur agricole.
    <br />
    <br />
    Veuillez noter qu'il s'agit de données déclaratives, elles peuvent donc être
    incomplètes.
  </p>
);

const AidesMinimisTable = ({
  aidesMinimis,
}: {
  aidesMinimis: IMinimis["aides"];
}) => (
  <FullTable
    body={aidesMinimis.map((a) => [
      a.regime,
      formatCurrency(a.montant),
      a.instrumentAide,
      a.secteurAide,
      formatDate(a.dateOctroi),
      a.autorite,
      a.operateur,
    ])}
    head={[
      "Régime",
      "Montant",
      "Instrument de l'aide",
      "Secteur de l'aide",
      "Date d'octroi",
      "Autorité",
      "Opérateur",
    ]}
  />
);

const aidesMinimisRoute = getRouteApi(
  "/_header-default/donnees-financieres/$slug"
);

export default function AidesMinimisProtected({
  uniteLegale,
  user,
}: {
  uniteLegale: IUniteLegale;
  user: IAgentInfo | null;
}) {
  const { "aides-minimis-page": currentPage } = aidesMinimisRoute.useSearch();
  const navigate = aidesMinimisRoute.useNavigate();
  const onPageChange = useCallback(
    (page: number) => {
      navigate({
        resetScroll: false,
        search: (prev) => ({ ...prev, "aides-minimis-page": page }),
      });
    },
    [navigate]
  );

  const input = useMemo(
    () => ({ siren: uniteLegale.siren, page: currentPage }),
    [uniteLegale.siren, currentPage]
  );

  const aidesMinimis = useServerActionData(
    getAgentAidesMinimisAction,
    user,
    input
  );

  return (
    <AsyncDataSectionClient
      data={aidesMinimis}
      id="aides-minimis"
      isProtected
      notFoundInfo={<NoAidesMinimis />}
      sources={[EAdministration.DINUM]}
      title="Aides Minimis"
    >
      {(aidesMinimis) =>
        aidesMinimis.aides?.length === 0 ? (
          <NoAidesMinimis />
        ) : (
          <>
            <MinimisDescription />
            <p>
              Un total de {aidesMinimis.aides.length} aides Minimis a été
              déclaré pour cette entreprise.
            </p>
            <AidesMinimisTable aidesMinimis={aidesMinimis.aides} />
            {aidesMinimis.meta.total > aidesMinimis.meta.page_size && (
              <LocalPageCounter
                compact={true}
                currentPage={currentPage}
                onPageChange={onPageChange}
                totalPages={Math.ceil(
                  aidesMinimis.meta.total / aidesMinimis.meta.page_size
                )}
              />
            )}
          </>
        )
      }
    </AsyncDataSectionClient>
  );
}
