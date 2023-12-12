import routes from '#clients/routes';
import Warning from '#components-ui/alerts/warning';
import ButtonLink from '#components-ui/button';
import FAQLink from '#components-ui/faq-link';
import { PrintNever } from '#components-ui/print-visibility';
import { Tag } from '#components-ui/tag';
import { DataSection } from '#components/section/data-section';
import { FullTable } from '#components/table/full';
import { EAdministration } from '#models/administrations/EAdministration';
import { IUniteLegale, isAssociation, isServicePublic } from '#models/index';
import { formatDateLong } from '#utils/helpers';
import { getFiscalYear } from '#utils/helpers/formatting/format-fiscal-year';
import useFetchActesRNE from 'hooks/fetch/actes-RNE';

const DocumentBilansSection: React.FC<{
  uniteLegale: IUniteLegale;
}> = ({ uniteLegale }) => {
  const documents = useFetchActesRNE(uniteLegale);

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
              Cette entreprise possède {documents.bilans.length} bilan(s)
              déposé(s) au RNE{' '}
              {documents.hasBilanConsolide && (
                <>
                  , dont certains sont des{' '}
                  <FAQLink
                    tooltipLabel="bilans consolidés"
                    to="/faq/donnees-financieres#quest-ce-quun-bilan-consolide"
                  >
                    Qu’est-ce qu’un bilan consolidé ?
                  </FAQLink>
                </>
              )}{' '}
              :
            </p>
            <FullTable
              head={['Date de dépôt', 'Année fiscale', '', 'Lien']}
              body={documents.bilans.map((a) => [
                formatDateLong(a.dateDepot),
                getFiscalYear(a.dateCloture),
                a.typeBilan === 'K' && <Tag color="info">bilan consolidé</Tag>,
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
