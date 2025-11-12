"use client";

import { useMemo } from "react";
import { getAgentRNEDocumentsAction } from "server-actions/agent/data-fetching";
import routes from "#clients/routes";
import { DataSectionClient } from "#components/section/data-section";
import { FullTable } from "#components/table/full";
import { Info } from "#components-ui/alerts";
import ButtonLink from "#components-ui/button";
import ShowMore from "#components-ui/show-more";
import { useServerActionData } from "#hooks/fetch/use-server-action-data";
import { EAdministration } from "#models/administrations/EAdministration";
import type { ISession } from "#models/authentication/user/session";
import { type IUniteLegale, isServicePublic } from "#models/core/types";
import type { IDocumentsRNE } from "#models/rne/types";
import { formatDateLong } from "#utils/helpers";

export const AgentActesRNE: React.FC<{
  uniteLegale: IUniteLegale;
  session: ISession | null;
}> = ({ uniteLegale, session }) => {
  const input = useMemo(
    () => ({ siren: uniteLegale.siren }),
    [uniteLegale.siren]
  );
  const documentsRne = useServerActionData(
    getAgentRNEDocumentsAction,
    session,
    input
  );

  return (
    <DataSectionClient
      data={documentsRne}
      id="actes"
      isProtected
      notFoundInfo={
        isServicePublic(uniteLegale) ? (
          <Info full>
            Les services publics ne sont pas immatriculés au RNE.
          </Info>
        ) : (
          <>Cette structure n’est pas immatriculée au RNE.</>
        )
      }
      sources={[EAdministration.INPI]}
      title="Actes et statuts"
    >
      {(documentsRne) =>
        documentsRne.actes?.length === 0 ? (
          <>Aucun document n’a été retrouvé dans le RNE pour cette structure.</>
        ) : (
          <>
            <p>
              Cette entreprise possède {documentsRne.actes.length} document(s)
              au RNE. Chaque document peut contenir un ou plusieurs actes :
            </p>
            {documentsRne.actes.length > 5 ? (
              <ShowMore
                label={`Voir tous les ${documentsRne.actes.length} documents`}
              >
                <ActesTable actes={documentsRne.actes} />
              </ShowMore>
            ) : (
              <ActesTable actes={documentsRne.actes} />
            )}
          </>
        )
      }
    </DataSectionClient>
  );
};

type IActesTableProps = {
  actes: IDocumentsRNE["actes"];
};
export function ActesTable({ actes }: IActesTableProps) {
  return (
    <FullTable
      body={actes.map((a) => [
        formatDateLong(a.dateDepot),
        <ul>
          {(a?.detailsDocuments || []).map(({ nom, label }) => (
            <li key={`${nom}-${label}`}>
              <strong>{nom}</strong>
              {label && (
                <>
                  {" - "}
                  <i>{label}</i>
                </>
              )}
            </li>
          ))}
        </ul>,
        <ButtonLink
          alt
          small
          target="_blank"
          to={`${routes.espaceAgent.documents.download}${a.id}?type=acte`}
        >
          Télécharger
        </ButtonLink>,
      ])}
      head={["Date de dépôt", "Acte(s) contenu(s)", "Lien"]}
    />
  );
}
