'use client';

import ButtonLink from '#components-ui/button';
import FAQLink from '#components-ui/faq-link';
import { DataSectionClient } from '#components/section/data-section';
import TableFilter from '#components/table/filter';
import { FullTable } from '#components/table/full';
import { EAdministration } from '#models/administrations/EAdministration';
import { IUniteLegale } from '#models/core/types';
import { isDataSuccess } from '#models/data-fetching';
import { ISession } from '#models/user/session';
import { formatDate, formatSiret } from '#utils/helpers';
import { extractAssociationEtablissements } from '#utils/helpers/association';
import { APIRoutesPaths } from 'app/api/data-fetching/routes-paths';
import { useAPIRouteData } from 'hooks/fetch/use-API-route-data';
import { useMemo, useState } from 'react';

const NoDocument = () => (
  <>Aucun document n’a été retrouvé pour cette association.</>
);

export const AgentActesAssociation: React.FC<{
  uniteLegale: IUniteLegale;
  session: ISession | null;
}> = ({ uniteLegale, session }) => {
  const [selectedSiret, setSelectedSiret] = useState<string[]>([]);

  const associationProtected = useAPIRouteData(
    APIRoutesPaths.EspaceAgentAssociationProtected,
    uniteLegale.siren,
    session
  );

  const etablissementsForFilter = useMemo(() => {
    if (!isDataSuccess(associationProtected)) {
      return [];
    }
    return extractAssociationEtablissements(associationProtected.documents.dac);
  }, [associationProtected]);

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
          {associationProtected.documents.rna.length === 0 &&
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
                head={['Dépôt', 'Description', 'Lien']}
                body={associationProtected.documents.rna.map(
                  ({ date_depot, sous_type, url }) => [
                    formatDate(date_depot),
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
                  sur Le Compte Asso
                </FAQLink>
              </h3>

              <TableFilter
                dataSelect={etablissementsForFilter}
                onChange={(e) => setSelectedSiret(e)}
                placeholder="Filtrer par établissement"
                fallback={null}
              />
              <FullTable
                head={['Siret', 'Dépôt', 'Validité', 'Description', 'Lien']}
                body={associationProtected.documents.dac
                  .filter((d) =>
                    selectedSiret.length > 0
                      ? selectedSiret.indexOf(d.etablissement.siret) > -1
                      : true
                  )
                  .map(
                    ({
                      date_depot,
                      nom,
                      annee_validite,
                      commentaire,
                      etablissement,
                      url,
                    }) => [
                      <a href={`/etablissement/${etablissement.siret}`}>
                        {formatSiret(etablissement.siret)}
                      </a>,
                      formatDate(date_depot),
                      annee_validite,
                      <>
                        <strong>{nom}</strong>
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
        </>
      )}
    </DataSectionClient>
  );
};
