'use client';

import routes from '#clients/routes';
import { Info } from '#components-ui/alerts';
import ButtonLink from '#components-ui/button';
import ShowMore from '#components-ui/show-more';
import { DataSectionClient } from '#components/section/data-section';
import { FullTable } from '#components/table/full';
import { EAdministration } from '#models/administrations/EAdministration';
import { IUniteLegale, isServicePublic } from '#models/core/types';
import { IActesRNE } from '#models/rne/types';
import { ISession } from '#models/user/session';
import { formatDateLong } from '#utils/helpers';
import { APIRoutesPaths } from 'app/api/data-fetching/routes-paths';
import { useAPIRouteData } from 'hooks/fetch/use-API-route-data';

export const AgentActesRNE: React.FC<{
  uniteLegale: IUniteLegale;
  session: ISession | null;
}> = ({ uniteLegale, session }) => {
  const documentsRne = useAPIRouteData(
    APIRoutesPaths.EspaceAgentRneDocuments,
    uniteLegale.siren,
    session
  );

  return (
    <DataSectionClient
      title="Actes et statuts"
      id="actes"
      isProtected
      sources={[EAdministration.INPI]}
      data={documentsRne}
      notFoundInfo={
        isServicePublic(uniteLegale) ? (
          <Info full>
            Les services publics ne sont pas immatriculés au RNE.
          </Info>
        ) : (
          <>Cette structure n’est pas immatriculée au RNE.</>
        )
      }
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
  actes: IActesRNE['actes'];
};
export function ActesTable({ actes }: IActesTableProps) {
  return (
    <FullTable
      head={['Date de dépôt', 'Acte(s) contenu(s)', 'Lien']}
      body={actes.map((a) => [
        formatDateLong(a.dateDepot),
        <ul>
          {(a?.detailsDocuments || []).map(({ nom, label }) => (
            <li key={nom}>
              <strong>{nom}</strong>
              {label && (
                <>
                  {' - '}
                  <i>{label}</i>
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
