'use client';

import { DataSectionClient } from '#components/section/data-section';
import { EAdministration } from '#models/administrations/EAdministration';
import { IUniteLegale } from '#models/core/types';
import useFetchRNEDocuments from 'hooks/fetch/RNE-documents';

const NoDocument = () => (
  <>Aucun document n’a été retrouvé pour cette association.</>
);

export const AgentDocumentsAssociation: React.FC<{
  uniteLegale: IUniteLegale;
}> = ({ uniteLegale }) => {
  const documents = useFetchRNEDocuments(uniteLegale);

  return (
    <DataSectionClient
      title="Actes et statuts"
      id="actes"
      isProtected
      sources={[EAdministration.MI]}
      data={documents}
      notFoundInfo={<NoDocument />}
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
            {/* {documents.actes.length >= 5 ? (
              <ShowMore
                label={`Voir les ${
                  documents.actes.length - 5
                } documents supplémentaires`}
              >
                <DocumentsTable actes={documents.actes} />
              </ShowMore>
            ) : (
              <DocumentsTable actes={documents.actes} />
            )} */}
          </>
        )
      }
    </DataSectionClient>
  );
};
