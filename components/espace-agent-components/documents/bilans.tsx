import routes from '#clients/routes';
import Warning from '#components-ui/alerts/warning';
import ButtonLink from '#components-ui/button';
import { PrintNever } from '#components-ui/print-visibility';
import { DataSection } from '#components/section/data-section';
import { FullTable } from '#components/table/full';
import { EAdministration } from '#models/administrations';
import { IUniteLegale, isAssociation, isServicePublic } from '#models/index';
import { formatDateLong } from '#utils/helpers';
import { getFiscalYear } from '#utils/helpers/formatting/format-fiscal-year';
import useFetchActes from 'hooks/fetch/documents';

const DocumentBilansSection: React.FC<{
  uniteLegale: IUniteLegale;
}> = ({ uniteLegale }) => {
  const documents = useFetchActes(uniteLegale);

  return (
    <PrintNever>
      <DataSection
        title="Bilans"
        id="bilans"
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
            Aucun comptes n’a été déposé au RNE pour cette entreprise.
          </>
        }
      >
        {(documents) => (
          <>
            <p>
              Cette entreprise possède {documents.bilans.length} compte(s)
              déposé(s) au RNE :
            </p>
            <FullTable
              head={['Date de dépôt', 'Année fiscale', 'Lien']}
              body={documents.bilans.map((a) => [
                formatDateLong(a.dateDepot),
                getFiscalYear(a.dateCloture),
                <ButtonLink
                  alt
                  small
                  target="_blank"
                  to={`${routes.api.rne.documents.download}${a.id}?type=bilan`}
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

export default DocumentBilansSection;
