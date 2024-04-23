'use client';

import routes from '#clients/routes';
import { Warning } from '#components-ui/alerts';
import ButtonLink from '#components-ui/button';
import { PrintNever } from '#components-ui/print-visibility';
import SeeMore from '#components-ui/see-more';
import { DataSectionClient } from '#components/section/data-section/client';
import { FullTable } from '#components/table/full';
import { EAdministration } from '#models/administrations/EAdministration';
import {
  IUniteLegale,
  isAssociation,
  isServicePublic,
} from '#models/core/types';
import { IActesRNE } from '#models/immatriculation';
import { formatDateLong } from '#utils/helpers';
import useFetchActesRNE from 'hooks/fetch/actes-RNE';

const NoDocument = () => (
  <>Aucun document n’a été retrouvé dans le RNE pour cette entreprise.</>
);

export const AgentActesSection: React.FC<{
  uniteLegale: IUniteLegale;
}> = ({ uniteLegale }) => {
  const documents = useFetchActesRNE(uniteLegale);

  return (
    <PrintNever>
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
              <ActesTable actes={documents.actes.slice(0, 5)} />
              {documents.actes.length > 5 && (
                <SeeMore aria-label="Voir le reste des actes">
                  <ActesTable actes={documents.actes.slice(5)} />
                </SeeMore>
              )}
            </>
          )
        }
      </DataSectionClient>
    </PrintNever>
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
              <li>{acteName}</li>
            ))}
          </ul>
        ),
        <ButtonLink
          target="_blank"
          alt
          small
          to={`${routes.api.rne.documents.download}${a.id}?type=acte`}
        >
          Télécharger
        </ButtonLink>,
      ])}
    />
  );
}
