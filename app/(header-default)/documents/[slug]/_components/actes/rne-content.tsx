"use client";

import routes from "#clients/routes";
import { FullTable } from "#components/table/full";
import ButtonLink from "#components-ui/button";
import ShowMore from "#components-ui/show-more";
import type { IDocumentsRNE } from "#models/rne/types";
import { formatDateLong } from "#utils/helpers";

type IRNEContentProps = {
  data: IDocumentsRNE;
};

export default function RNEContent({ data: documentsRne }: IRNEContentProps) {
  return documentsRne.actes?.length === 0 ? (
    <>Aucun document n’a été retrouvé dans le RNE pour cette structure.</>
  ) : (
    <>
      <p>
        Cette entreprise possède {documentsRne.actes.length} document(s) au RNE.
        Chaque document peut contenir un ou plusieurs actes :
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
  );
}

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
