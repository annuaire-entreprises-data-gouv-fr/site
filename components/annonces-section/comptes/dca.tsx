'use client';

import React from 'react';
import routes from '#clients/routes';
import ButtonLink from '#components-ui/button';
import { DILA } from '#components/administrations';
import { AsyncDataSectionClient } from '#components/section/data-section/client';
import { FullTable } from '#components/table/full';
import { UniteLegalePageLink } from '#components/unite-legale-page-link';
import { EAdministration } from '#models/administrations/EAdministration';
import { IAssociation } from '#models/core/types';
import { formatDate } from '#utils/helpers';
import { useFetchComptesAssociation } from 'hooks';

export const ComptesAssociationSection: React.FC<{
  uniteLegale: IAssociation;
}> = ({ uniteLegale }) => {
  const comptes = useFetchComptesAssociation(uniteLegale);
  return (
    <AsyncDataSectionClient
      data={comptes}
      title="Dépôts des Comptes des Associations"
      sources={[EAdministration.DILA]}
    >
      {(comptes) =>
        comptes.annonces.length === 0 ? (
          <div>
            Cette association n’a aucun compte déposé au{' '}
            <a
              target="_blank"
              rel="noreferrer noopener"
              href={routes.journalOfficielAssociations.site.recherche}
            >
              Journal Officiel des Associations (JOAFE)
            </a>
            .
          </div>
        ) : (
          <>
            <p>
              Cette structure possède {comptes.annonces.length} comptes publiés
              au <strong>Journal Officiel des Associations (JOAFE)</strong>
              , consolidé par la <DILA />. Pour en savoir plus, vous pouvez
              consulter{' '}
              <UniteLegalePageLink
                uniteLegale={uniteLegale}
                href={`${routes.journalOfficielAssociations.site.recherche}?q=${uniteLegale.siren}`}
                siteName="le site du JOAFE"
              />
              &nbsp;:
            </p>
            <FullTable
              head={['Publication', 'Type d’annonce', 'Consulter les comptes']}
              body={comptes.annonces.map((annonce) => [
                <strong>{formatDate(annonce.datePublication)}</strong>,
                <>
                  <div>
                    <strong>{annonce.typeAvisLibelle}</strong>
                  </div>
                  {annonce.details}
                  <div>
                    <i className="font-small">
                      Annonce n°{annonce.numeroParution}
                    </i>
                  </div>
                </>,
                <ButtonLink target="_blank" to={annonce.path} alt small>
                  ⇢&nbsp;Consulter
                </ButtonLink>,
              ])}
            />
          </>
        )
      }
    </AsyncDataSectionClient>
  );
};
