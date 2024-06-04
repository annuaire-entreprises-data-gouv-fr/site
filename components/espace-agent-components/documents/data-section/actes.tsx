'use client';

import routes from '#clients/routes';
import { Warning } from '#components-ui/alerts';
import ButtonLink from '#components-ui/button';
import ShowMore from '#components-ui/show-more';
import { DataSectionClient } from '#components/section/data-section';
import { FullTable } from '#components/table/full';
import { EAdministration } from '#models/administrations/EAdministration';
import {
  IUniteLegale,
  isAssociation,
  isServicePublic,
} from '#models/core/types';
import { IActesRNE } from '#models/immatriculation';
import { formatDateLong } from '#utils/helpers';
import useFetchRNEDocuments from 'hooks/fetch/RNE-documents';

const NoDocument = () => (
  <>Aucun document n’a été retrouvé dans le RNE pour cette entreprise.</>
);

export const AgentActesSection: React.FC<{
  uniteLegale: IUniteLegale;
}> = ({ uniteLegale }) => {
  const documents = useFetchRNEDocuments(uniteLegale);

  return (
    <DataSectionClient
      title="Actes et statuts"
      id="actes"
      isProtected
      sources={[EAdministration.INPI]}
      data={documents}
      notFoundInfo={
        <>
          {(isAssociation(uniteLegale) || isServicePublic(uniteLegale)) && (
            <>
              <Warning full>
                Les associations et les services publics ne sont pas
                immatriculés au RNE.
              </Warning>
              <br />
            </>
          )}
          <NoDocument />
        </>
      }
    >
      {(documents) =>
        documents.actes?.length === 0 ? (
          <NoDocument />
        ) : (
          <>
            <p>
              Cette entreprise possède {documents.actes.length} document(s) au
              RNE. Chaque document peut contenir un ou plusieurs actes :
            </p>
            {documents.actes.length >= 5 ? (
              <ShowMore
                label={`Voir les ${
                  documents.actes.length - 5
                } documents supplémentaires`}
              >
                <ActesTable actes={documents.actes} />
              </ShowMore>
            ) : (
              <ActesTable actes={documents.actes} />
            )}
          </>
        )
      }
    </DataSectionClient>
  );
};

type IActesTableProps = {
  actes: IActesRNE['actes'];
};
function ActesTable({ actes }: IActesTableProps) {
  return (
    <FullTable
      head={['Date de dépôt', 'Acte(s) contenu(s)', 'Lien']}
      body={actes.map((a) => [
        formatDateLong(a.dateDepot),
        a.actes && (
          <ul>
            {(a?.actes || []).map((acteName) => (
              <li key={acteName}>{acteName}</li>
            ))}
          </ul>
        ),
        <ButtonLink
          target="_blank"
          alt
          small
          to={`${routes.api.espaceAgent.rne.documents.download}${a.id}?type=acte`}
        >
          Télécharger
        </ButtonLink>,
      ])}
    />
  );
}
