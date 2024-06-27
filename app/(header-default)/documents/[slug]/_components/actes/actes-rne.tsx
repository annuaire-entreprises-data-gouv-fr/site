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
import { ISession } from '#models/user/session';
import { formatDateLong } from '#utils/helpers';
import { useAPIRouteData } from 'hooks/fetch/use-API-route-data';

export const AgentActesRNE: React.FC<{
  uniteLegale: IUniteLegale;
  session: ISession | null;
}> = ({ uniteLegale, session }) => {
  const documents = useAPIRouteData(
    'espace-agent/rne/documents',
    uniteLegale.siren,
    session
  );

  return (
    <DataSectionClient
      title="Actes et statuts"
      id="actes"
      isProtected
      sources={[EAdministration.INPI]}
      data={documents}
      //@ts-ignore
      notFoundInfo={
        isAssociation(uniteLegale) ? null : (
          <>
            {isServicePublic(uniteLegale) && (
              <Warning full>
                Les services publics ne sont pas immatriculés au RNE.
              </Warning>
            )}
          </>
        )
      }
    >
      {(documents) =>
        documents.actes?.length === 0 ? (
          <>
            Aucun document n’a été retrouvé dans le RNE pour cette entreprise.
          </>
        ) : (
          <>
            <p>
              Cette entreprise possède {documents.actes.length} document(s) au
              RNE. Chaque document peut contenir un ou plusieurs actes :
            </p>
            {documents.actes.length > 5 ? (
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
        <ul>
          {(a?.detailsDocuments || []).map(({ nom, label }) => (
            <li key={nom}>
              <b>{nom}</b>
              {label && (
                <>
                  {' - '}
                  <i>label</i>
                </>
              )}
            </li>
          ))}
        </ul>,
        <ButtonLink
          target="_blank"
          alt
          small
          to={`${routes.espaceAgent.documents.download}${a.id}?type=acte`}
        >
          Télécharger
        </ButtonLink>,
      ])}
    />
  );
}
