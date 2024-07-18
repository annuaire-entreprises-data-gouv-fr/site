'use client';

import ButtonLink from '#components-ui/button';
import FAQLink from '#components-ui/faq-link';
import { DataSectionClient } from '#components/section/data-section';
import { FullTable } from '#components/table/full';
import { EAdministration } from '#models/administrations/EAdministration';
import { IUniteLegale } from '#models/core/types';
import { hasAnyError, isDataLoading } from '#models/data-fetching';
import { ISession } from '#models/user/session';
import { formatSiret } from '#utils/helpers';
import { useAPIRouteData } from 'hooks/fetch/use-API-route-data';
import { ActesTable } from './rne';

const NoDocument = () => (
  <>Aucun document n’a été retrouvé pour cette association.</>
);

export const AgentActesAssociation: React.FC<{
  uniteLegale: IUniteLegale;
  session: ISession | null;
}> = ({ uniteLegale, session }) => {
  const associationProtected = useAPIRouteData(
    'espace-agent/association-protected',
    uniteLegale.siren,
    session
  );

  const actesRne = useAPIRouteData(
    'espace-agent/rne/documents',
    uniteLegale.siren,
    session
  );

  const hasActesRNE =
    !isDataLoading(actesRne) &&
    !hasAnyError(actesRne) &&
    actesRne.actes.length > 0;

  return (
    <DataSectionClient
      title="Actes et statuts"
      id="actes"
      isProtected
      sources={[EAdministration.MI, EAdministration.DJEPVA]}
      data={associationProtected}
      notFoundInfo={<NoDocument />}
    >
      {(associationProtected) => (
        <>
          {hasActesRNE &&
            associationProtected.documents.rna.length === 0 &&
            associationProtected.documents.dac.length === 0 && <NoDocument />}

          {associationProtected.documents.rna.length > 0 && (
            <>
              <h3>
                Documents au{' '}
                <FAQLink tooltipLabel="RNA">
                  Registre National des Associations
                </FAQLink>
              </h3>
              <FullTable
                head={['Date de dépôt', 'Description', 'Lien']}
                body={associationProtected.documents.rna.map(
                  ({ date_depot, sous_type, url }) => [
                    date_depot,
                    sous_type.libelle,
                    <ButtonLink target="_blank" alt small to={url}>
                      Télécharger
                    </ButtonLink>,
                  ]
                )}
              />
            </>
          )}
          {associationProtected.documents.dac.length > 0 && (
            <>
              <h3>
                <FAQLink tooltipLabel="Documents Administratifs Complémentaires (DAC)">
                  Documents déposés par l’association lors de démarches en ligne
                  sur{' '}
                  <a href="https://lecompteasso.associations.gouv.fr/">
                    Le Compte Asso
                  </a>
                </FAQLink>
              </h3>
              <FullTable
                head={[
                  'Date de dépôt',
                  'Établissement',
                  'Année de validité',
                  'Description',
                  'Lien',
                ]}
                body={associationProtected.documents.dac.map(
                  ({
                    date_depot,
                    nom,
                    annee_validite,
                    commentaire,
                    siret,
                    url,
                  }) => [
                    date_depot,
                    <a href={`/etablissement/${siret}`}>
                      {formatSiret(siret)}
                    </a>,
                    annee_validite,
                    <>
                      <b>{nom}</b>
                      <br />
                      {commentaire && <i>{commentaire}</i>}
                    </>,
                    <ButtonLink target="_blank" alt small to={url}>
                      Télécharger
                    </ButtonLink>,
                  ]
                )}
              />
            </>
          )}
          {hasActesRNE && (
            <>
              <h3>Actes au RNE</h3>
              <ActesTable actes={actesRne.actes} />
            </>
          )}
        </>
      )}
    </DataSectionClient>
  );
};
