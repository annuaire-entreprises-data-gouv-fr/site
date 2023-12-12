import routes from '#clients/routes';
import Warning from '#components-ui/alerts/warning';
import ButtonLink from '#components-ui/button';
import { PrintNever } from '#components-ui/print-visibility';
import { DataSection } from '#components/section/data-section';
import { FullTable } from '#components/table/full';
import { EAdministration } from '#models/administrations/EAdministration';
import { IUniteLegale, isAssociation, isServicePublic } from '#models/index';
import { formatDateLong } from '#utils/helpers';
import useFetchActesRNE from 'hooks/fetch/actes-RNE';

const DocumentActesSection: React.FC<{
  uniteLegale: IUniteLegale;
}> = ({ uniteLegale }) => {
  const documents = useFetchActesRNE(uniteLegale);

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
                  to={`${routes.api.rne.documents.download}${a.id}?type=acte`}
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
