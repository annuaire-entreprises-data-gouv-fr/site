import { getRouteApi } from "@tanstack/react-router";
import type React from "react";
import { useCallback } from "react";
import type {
  IMarchePublic,
  IMarchePublicItem,
} from "#/clients/open-data-soft/clients/marche-public/interface";
import NonRenseigne from "#/components/non-renseigne";
import LocalPageCounter from "#/components/search-results/results-pagination/local-pagination";
import { AsyncDataSectionClient } from "#/components/section/data-section/client";
import { FullTable } from "#/components/table/full";
import { useFetchMarchePublic } from "#/hooks/fetch/marche-public";
import { EAdministration } from "#/models/administrations/e-administration";
import type { ICollectiviteTerritoriale } from "#/models/core/types";
import { formatCurrency, formatDate } from "#/utils/helpers";

const financesRoute = getRouteApi(
  "/_header-default/collectivite/$slug/finances"
);

const NoMarchePublic = ({
  uniteLegale,
}: {
  uniteLegale: ICollectiviteTerritoriale;
}) => (
  <p>
    Aucun marché public n’a été retrouvé pour la collectivité{" "}
    {uniteLegale.nomComplet}.
  </p>
);

const formatOptional = (value?: string | null) =>
  value ? value : <NonRenseigne />;

const Titulaire = ({ marche }: { marche: IMarchePublicItem }) => {
  if (!marche.titulaireId1) {
    return <NonRenseigne />;
  }

  return (
    <a
      href={`/entreprise/${marche.titulaireId1}`}
      rel="noreferrer noopener"
      target="_blank"
    >
      {marche.titulaireId1}
    </a>
  );
};

const getMarchePublicLabel = (count: number) =>
  `${count.toLocaleString("fr-FR")} marché${count > 1 ? "s" : ""} public${
    count > 1 ? "s" : ""
  }`;

const MarchePublicTable = ({
  marchesPublics,
}: {
  marchesPublics: IMarchePublic["data"];
}) => (
  <FullTable
    body={marchesPublics.map((marche) => [
      marche.dateNotification ? (
        <strong>{formatDate(marche.dateNotification)}</strong>
      ) : (
        <NonRenseigne />
      ),
      formatCurrency(marche.montant),
      <>
        <div>
          <strong>{formatOptional(marche.objet)}</strong>
        </div>
        <div>
          <i className="font-small">
            Nature : {formatOptional(marche.nature)}
            {marche.codeCPV ? <> - CPV {marche.codeCPV}</> : null}
            {marche.marcheInnovant ? (
              <> - Marché innovant : {marche.marcheInnovant}</>
            ) : null}
          </i>
        </div>
      </>,
      <Titulaire marche={marche} />,
    ])}
    head={["Notification", "Montant", "Objet", "Titulaire"]}
    verticalAlign="top"
  />
);

export const CollectiviteMarchePublicSection: React.FC<{
  uniteLegale: ICollectiviteTerritoriale;
}> = ({ uniteLegale }) => {
  const { "marches-publics-page": currentPage } = financesRoute.useSearch();
  const navigate = financesRoute.useNavigate();
  const marchesPublics = useFetchMarchePublic(uniteLegale, currentPage);

  const onPageChange = useCallback(
    (page: number) => {
      navigate({
        resetScroll: false,
        search: (prev) => ({ ...prev, "marches-publics-page": page }),
      });
    },
    [navigate]
  );

  return (
    <AsyncDataSectionClient
      data={marchesPublics}
      id="marches-publics"
      notFoundInfo={<NoMarchePublic uniteLegale={uniteLegale} />}
      sources={[EAdministration.MEF]}
      title="Marchés publics"
    >
      {(marchesPublics) =>
        marchesPublics.data.length === 0 ? (
          <NoMarchePublic uniteLegale={uniteLegale} />
        ) : (
          <>
            <p>
              {getMarchePublicLabel(marchesPublics.meta.total)}{" "}
              {marchesPublics.meta.total > 1
                ? "ont été retrouvés"
                : "a été retrouvé"}{" "}
              pour cette collectivité en tant qu’acheteur public.
            </p>
            <MarchePublicTable marchesPublics={marchesPublics.data} />
            {marchesPublics.meta.total > marchesPublics.meta.page_size && (
              <LocalPageCounter
                compact={true}
                currentPage={currentPage}
                onPageChange={onPageChange}
                totalPages={Math.ceil(
                  marchesPublics.meta.total / marchesPublics.meta.page_size
                )}
              />
            )}
          </>
        )
      }
    </AsyncDataSectionClient>
  );
};
