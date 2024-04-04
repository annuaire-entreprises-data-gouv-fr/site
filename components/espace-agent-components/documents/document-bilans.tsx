import routes from '#clients/routes';
import { Warning } from '#components-ui/alerts';
import ButtonLink from '#components-ui/button';
import FAQLink from '#components-ui/faq-link';
import { PrintNever } from '#components-ui/print-visibility';
import { Tag } from '#components-ui/tag';
import { DataSectionClient } from '#components/section/data-section/client';
import { FullTable } from '#components/table/full';
import { EAdministration } from '#models/administrations/EAdministration';
import {
  IUniteLegale,
  isAssociation,
  isServicePublic,
} from '#models/core/types';
import { EScope, hasRights } from '#models/user/rights';
import { ISession } from '#models/user/session';
import { formatDateLong } from '#utils/helpers';
import { getFiscalYear } from '#utils/helpers/formatting/format-fiscal-year';
import useFetchActesRNE from 'hooks/fetch/actes-RNE';
import AgentWallDocuments from '../agent-wall/documents';

const NoBilans = () => (
  <>Aucun comptes n’a été déposé au RNE pour cette entreprise.</>
);

const AgentComponent: React.FC<{
  uniteLegale: IUniteLegale;
}> = ({ uniteLegale }) => {
  const documents = useFetchActesRNE(uniteLegale);

  return (
    <PrintNever>
      <DataSectionClient
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
                  Les associations et les services publics ne sont pas
                  immatriculés au RNE.
                </Warning>
                <br />
              </>
            )}
            <NoBilans />
          </>
        }
      >
        {(documents) =>
          documents.bilans?.length === 0 ? (
            <NoBilans />
          ) : (
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
                  a.typeBilan === 'K' && (
                    <Tag color="info">bilan consolidé</Tag>
                  ),
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
          )
        }
      </DataSectionClient>
    </PrintNever>
  );
};

const DocumentBilansSection: React.FC<{
  uniteLegale: IUniteLegale;
  session: ISession | null;
}> = ({ uniteLegale, session }) => {
  if (!hasRights(session, EScope.bilansRne)) {
    return (
      <AgentWallDocuments
        title="Bilans"
        id="bilans"
        uniteLegale={uniteLegale}
      />
    );
  }

  return <AgentComponent uniteLegale={uniteLegale} />;
};

export default DocumentBilansSection;
