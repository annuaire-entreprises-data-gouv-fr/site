'use client';

import routes from '#clients/routes';
import { Warning } from '#components-ui/alerts';
import ButtonLink from '#components-ui/button';
import FAQLink from '#components-ui/faq-link';
import { AsyncDataSectionClient } from '#components/section/data-section/client';
import { FullTable } from '#components/table/full';
import { EAdministration } from '#models/administrations/EAdministration';
import { ISession } from '#models/authentication/user/session';
import {
  IUniteLegale,
  isAssociation,
  isServicePublic,
} from '#models/core/types';
import { IActesRNE } from '#models/rne/types';
import { formatDateLong, pluralize } from '#utils/helpers';
import { getFiscalYear } from '#utils/helpers/formatting/format-fiscal-year';
import { APIRoutesPaths } from 'app/api/data-fetching/routes-paths';
import { useAPIRouteData } from 'hooks/fetch/use-API-route-data';
import { BilanTypeTag } from '../bilan-tag';

const NoBilans = () => (
  <>Aucun compte n’a été déposé au RNE pour cette entreprise.</>
);

const BilansTable = ({ bilans }: { bilans: IActesRNE['bilans'] }) => (
  <FullTable
    head={['Date de dépôt', 'Année fiscale', 'Type de bilan', 'Lien']}
    body={bilans.map((a) => [
      formatDateLong(a.dateDepot),
      getFiscalYear(a.dateCloture),
      <BilanTypeTag type={a.typeBilan} />,
      <ButtonLink
        alt
        small
        target="_blank"
        to={`${routes.espaceAgent.documents.download}${a.id}?type=bilan`}
      >
        Télécharger
      </ButtonLink>,
    ])}
  />
);

export default function BilansDocumentsSocieteProtected({
  uniteLegale,
  session,
}: {
  uniteLegale: IUniteLegale;
  session: ISession | null;
}) {
  const documents = useAPIRouteData(
    APIRoutesPaths.EspaceAgentRneDocuments,
    uniteLegale.siren,
    session
  );
  return (
    <AsyncDataSectionClient
      title="Bilans au format PDF"
      id="bilans-pdf"
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
              Cette entreprise possède {documents.bilans.length} bilan
              {pluralize(documents.bilans)} déposé{pluralize(documents.bilans)}{' '}
              au RNE :
            </p>
            {documents.hasBilanConsolide && (
              <>
                <h3>
                  Bilans{' '}
                  <FAQLink tooltipLabel="Consolidés">
                    Une entreprise peut déposer différents types de bilans :
                    <ul>
                      <li>simplifié : un bilan allégée</li>
                      <li>complet : le bilan classique</li>
                      <li>
                        consolidé : un bilan qui intègre les données des
                        filiales d’un groupe
                      </li>
                    </ul>
                  </FAQLink>
                </h3>
                <div>
                  Cette entreprise a notamment déclaré des{' '}
                  <FAQLink
                    tooltipLabel="bilans consolidés"
                    to="/faq/donnees-financieres#quest-ce-quun-bilan-consolide"
                  >
                    Qu’est-ce qu’un bilan consolidé ?
                  </FAQLink>
                </div>
                <br />
                <BilansTable
                  bilans={documents.bilans.filter((b) => b.typeBilan === 'K')}
                />
                <br />
              </>
            )}
            <h3>
              Bilans{' '}
              <FAQLink tooltipLabel="Complets ou Simplifiés">
                Une entreprise peut déposer différents types de bilans :
                <ul>
                  <li>simplifié : un bilan allégé</li>
                  <li>complet : le bilan classique</li>
                  <li>
                    consolidé : un bilan qui intègre les données des filiales
                    d’un groupe
                  </li>
                </ul>
              </FAQLink>
            </h3>
            <BilansTable
              bilans={documents.bilans.filter((b) => b.typeBilan !== 'K')}
            />
          </>
        )
      }
    </AsyncDataSectionClient>
  );
}
