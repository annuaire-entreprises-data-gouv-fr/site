import React from 'react';
import routes from '#clients/routes';
import ButtonLink from '#components-ui/button';
import { Tag } from '#components-ui/tag';
import { DILA } from '#components/administrations';
import { DataSection } from '#components/section/data-section';
import { FullTable } from '#components/table/full';
import { EAdministration } from '#models/administrations';
import { IComptesAssociation } from '#models/annonces';
import { IAPILoading } from '#models/api-loading';
import { IAPINotRespondingError } from '#models/api-not-responding';
import { IAssociation } from '#models/index';
import { formatDate } from '#utils/helpers';

export const ComptesAssociationSection: React.FC<{
  association: IAssociation;
  comptesAssociation:
    | IComptesAssociation
    | IAPINotRespondingError
    | IAPILoading;
}> = ({ association, comptesAssociation }) => {
  return (
    <DataSection
      data={comptesAssociation}
      title="Dépôt de Comptes des Associations"
      sources={[EAdministration.DILA]}
      notFoundInfo={null}
    >
      {(comptesAssociation) =>
        comptesAssociation.comptes.length === 0 ? (
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
              Cette structure possède {comptesAssociation.comptes.length}{' '}
              comptes publiés au{' '}
              <b>Journal Officiel des Associations (JOAFE)</b>
              , consolidé par la <DILA />. Pour en savoir plus, vous pouvez
              consulter{' '}
              <a
                rel="noreferrer noopener"
                target="_blank"
                href={`${routes.journalOfficielAssociations.site.recherche}?q=${association.siren}`}
              >
                la page de cette association
              </a>{' '}
              sur le site du JOAFE&nbsp;:
            </p>
            <FullTable
              head={[
                'Date de déclaration',
                'N° parution',
                'Détails',
                'Dépôt des comptes',
              ]}
              body={comptesAssociation.comptes.map((compte) => [
                <b>{formatDate(compte.dateparution)}</b>,
                <Tag>{compte.numeroParution}</Tag>,
                <div>
                  <b>Comptes {compte.anneeCloture}</b> <br />
                  clôturés le {formatDate(compte.datecloture)}
                </div>,
                <ButtonLink target="_blank" to={compte.permalinkUrl} alt small>
                  ⇢&nbsp;Consulter
                </ButtonLink>,
              ])}
            />
            <style jsx>{`
              .annonce {
                margin: 5px 0;
              }
            `}</style>
          </>
        )
      }
    </DataSection>
  );
};
