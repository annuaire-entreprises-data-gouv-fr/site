import { useId, useMemo, useState } from "react";
import routes from "#/clients/routes";
import { DataSectionClient } from "#/components/section/data-section";
import { FullTable } from "#/components/table/full";
import { Info } from "#/components-ui/alerts";
import ButtonLink from "#/components-ui/button";
import { useServerFnData } from "#/hooks/fetch/use-server-fn-data";
import { EAdministration } from "#/models/administrations/e-administration";
import { ApplicationRights } from "#/models/authentication/user/rights";
import { type IUniteLegale, isServicePublic } from "#/models/core/types";
import type { IDocumentsRNE } from "#/models/rne/types";
import { getAgentRneDocumentsFn } from "#/server-functions/agent/data-fetching";
import { formatDateLong } from "#/utils/helpers";

export const AgentActesRNE: React.FC<{
  uniteLegale: IUniteLegale;
}> = ({ uniteLegale }) => {
  const input = useMemo(
    () => ({ siren: uniteLegale.siren }),
    [uniteLegale.siren]
  );
  const documentsRne = useServerFnData(
    getAgentRneDocumentsFn,
    input,
    ApplicationRights.documentsRne
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
            <ExpandableActesTable actes={documentsRne.actes} />
          </>
        )
      }
    </DataSectionClient>
  );
};

interface IActesTableProps {
  actes: IDocumentsRNE["actes"];
}
function ExpandableActesTable({ actes }: IActesTableProps) {
  const [expanded, setExpanded] = useState(false);
  const id = useId();
  return (
    <>
      {actes.length > 5 && (
        <button
          aria-controls={id}
          aria-expanded={expanded}
          className="fr-btn fr-btn--secondary fr-mb-2w"
          onClick={() => setExpanded(!expanded)}
          type="button"
        >
          {expanded ? "Voir moins" : `Voir tous les ${actes.length} documents`}
        </button>
      )}
      <div id={id}>
        <ActesTable actes={expanded ? actes : actes.slice(0, 5)} />
      </div>
    </>
  );
}

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
          aria-label={`Télécharger les actes déposés le ${formatDateLong(a.dateDepot)} — nouvelle fenêtre`}
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
