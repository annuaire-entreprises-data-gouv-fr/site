'use client';

import ButtonLink from '#components-ui/button';
import { DataSectionClient } from '#components/section/data-section';
import { FullTable } from '#components/table/full';
import { EAdministration } from '#models/administrations/EAdministration';
import { IAPINotRespondingError } from '#models/api-not-responding';
import { IUniteLegale } from '#models/core/types';
import {
  IDataFetchingState,
  hasAnyError,
  isDataLoading,
} from '#models/data-fetching';
import { IActesRNE } from '#models/immatriculation';
import { ISession } from '#models/user/session';
import { formatSiret } from '#utils/helpers';
import { useAPIRouteData } from 'hooks/fetch/use-API-route-data';
import { ActesTable } from './actes-rne';

const NoDocument = () => (
  <>Aucun document n’a été retrouvé pour cette association.</>
);

export const AgentDocumentsAssociation: React.FC<{
  uniteLegale: IUniteLegale;
  session: ISession | null;
  documentsRne: IActesRNE | IAPINotRespondingError | IDataFetchingState;
}> = ({ uniteLegale, session, documentsRne }) => {
  const associationProtected = useAPIRouteData(
    'espace-agent/association-protected',
    uniteLegale.siren,
    session
  );

  const hasDocumentsRNE =
    !isDataLoading(documentsRne) &&
    !hasAnyError(documentsRne) &&
    documentsRne.actes.length > 0;

  return (
    <DataSectionClient
      title="Actes et statuts"
      id="actes"
      isProtected
      sources={[
        EAdministration.MI,
        EAdministration.DJEPVA,
        ...(hasDocumentsRNE ? [EAdministration.INPI] : []),
      ]}
      data={associationProtected}
      notFoundInfo={<NoDocument />}
    >
      {(associationProtected) => (
        <>
          {!hasDocumentsRNE &&
            associationProtected.documents.rna.length === 0 &&
            associationProtected.documents.dac.length === 0 && <NoDocument />}

          {associationProtected.documents.rna.length > 0 && (
            <>
              <h3>Documents présents dans le registre RNA</h3>
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
              <h3>Documents Administratifs Complémentaires</h3>
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
          {hasDocumentsRNE && (
            <>
              <h3>Documents au RNE</h3>
              <ActesTable actes={documentsRne.actes} />
            </>
          )}
        </>
      )}
    </DataSectionClient>
  );
};
