import routes from '#clients/routes';
import Warning from '#components-ui/alerts/warning';
import ButtonLink from '#components-ui/button';
import { PrintNever } from '#components-ui/print-visibility';
import { DataSection } from '#components/section/data-section';
import { FullTable } from '#components/table/full';
import { EAdministration } from '#models/administrations';
import { IUniteLegale, isAssociation, isServicePublic } from '#models/index';
import { formatDateLong } from '#utils/helpers';
import useFetchActes from 'hooks/fetch/documents';

const DocumentActesSection: React.FC<{
  uniteLegale: IUniteLegale;
}> = ({ uniteLegale }) => {
  const documents = useFetchActes(uniteLegale);

  return (
    <PrintNever>
      <DataSection
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
                  Les asociations et les services publics ne sont pas
                  immatriculés au RNE.
                </Warning>
                <br />
              </>
            )}
            Aucun document n’a été retrouvé dans le RNE pour cette entreprise.
          </>
        }
      >
        {(documents) => (
          <>
            <p>
              Cette entreprise possède {documents.actes.length} document(s) au
              RNE. Chaque document peut contenir un ou plusieurs actes :
            </p>
            <FullTable
              head={['Date de dépôt', 'Acte(s) contenu(s)', 'Lien']}
              body={documents.actes.map((a) => [
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
                  to={routes.api.actes.download + a.id}
                >
                  Télécharger
                </ButtonLink>,
              ])}
            />
          </>
        )}
      </DataSection>
    </PrintNever>
  );
};

export default DocumentActesSection;
