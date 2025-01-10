'use client';

import routes from '#clients/routes';
import { Warning } from '#components-ui/alerts';
import ButtonLink from '#components-ui/button';
import FAQLink from '#components-ui/faq-link';
import { Tag } from '#components-ui/tag';
import { AsyncDataSectionClient } from '#components/section/data-section/client';
import { FullTable } from '#components/table/full';
import { EAdministration } from '#models/administrations/EAdministration';
import {
  IUniteLegale,
  isAssociation,
  isServicePublic,
} from '#models/core/types';
import { ISession } from '#models/user/session';
import { formatDateLong } from '#utils/helpers';
import { getFiscalYear } from '#utils/helpers/formatting/format-fiscal-year';
import { APIRoutesPaths } from 'app/api/data-fetching/routes-paths';
import { useAPIRouteData } from 'hooks/fetch/use-API-route-data';

const NoBilans = () => (
  <>Aucun compte n’a été déposé au RNE pour cette entreprise.</>
);

const AgentBilansSection: React.FC<{
  uniteLegale: IUniteLegale;
  session: ISession | null;
}> = ({ uniteLegale, session }) => {
  const documents = useAPIRouteData(
    APIRoutesPaths.EspaceAgentRneDocuments,
    uniteLegale.siren,
    session
  );
  return (
    <AsyncDataSectionClient
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
              head={[
                'Date de dépôt',
                'Année fiscale',
                <FAQLink tooltipLabel="Type">
                  Une entreprise peut déposer différents types de bilans :
                  <ul>
                    <li>simplifié : un bilan allégée</li>
                    <li>complet : le bilan classique</li>
                    <li>
                      consolidé : un bilan qui intègre les données des filiales
                      d’un groupe
                    </li>
                  </ul>
                </FAQLink>,
                'Lien',
              ]}
              body={documents.bilans.map((a) => [
                formatDateLong(a.dateDepot),
                getFiscalYear(a.dateCloture),
                <>
                  {a.typeBilan === 'K' ? (
                    <Tag color="info">consolidé</Tag>
                  ) : a.typeBilan === 'C' ? (
                    <Tag color="info">complet</Tag>
                  ) : (
                    <Tag color="info">simplifié</Tag>
                  )}
                </>,
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
          </>
        )
      }
    </AsyncDataSectionClient>
  );
};

export default AgentBilansSection;
