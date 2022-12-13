import React from 'react';
import routes from '#clients/routes';
import ButtonLink from '#components-ui/button';
import { Tag } from '#components-ui/tag';
import AdministrationNotResponding from '#components/administration-not-responding';
import { DILA } from '#components/administrations';
import { Section } from '#components/section';
import { FullTable } from '#components/table/full';
import { EAdministration } from '#models/administrations';
import { IComptesAssociation } from '#models/annonces';
import {
  IAPINotRespondingError,
  isAPINotResponding,
} from '#models/api-not-responding';
import { IUniteLegale } from '#models/index';
import { formatDate } from '#utils/helpers';

export const ComptesAssociationSection: React.FC<{
  uniteLegale: IUniteLegale;
  comptesAssociation: IComptesAssociation | IAPINotRespondingError;
}> = ({ uniteLegale, comptesAssociation }) => {
  if (isAPINotResponding(comptesAssociation)) {
    return (
      <AdministrationNotResponding
        administration={comptesAssociation.administration}
        errorType={comptesAssociation.errorType}
        title="Dépôt des Comptes Association"
      />
    );
  }

  return (
    <Section
      title="Dépôt de Comptes des Associations"
      sources={[EAdministration.DILA]}
      lastModified={comptesAssociation.lastModified}
    >
      {comptesAssociation.comptes.length === 0 ? (
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
            Cette structure possède {comptesAssociation.comptes.length} comptes
            publiés au <b>Journal Officiel des Associations (JOAFE)</b>
            , consolidé par la <DILA />. Pour en savoir plus, vous pouvez
            consulter{' '}
            <a
              rel="noreferrer noopener nofollow"
              target="_blank"
              href={`${routes.journalOfficielAssociations.site.recherche}?q=${uniteLegale.siren}`}
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
        </>
      )}
      <style jsx>{`
        .annonce {
          margin: 5px 0;
        }
      `}</style>
    </Section>
  );
};
