import React from 'react';
import routes from '#clients/routes';
import AdministrationNotResponding from '#components/administration-not-responding';
import { DILA } from '#components/administrations';
import { Section } from '#components/section';
import { FullTable } from '#components/table/full';
import AssociationCreationNotFoundAlert from '#components-ui/alerts/association-creation-not-found-alert';
import ButtonLink from '#components-ui/button';
import { Tag } from '#components-ui/tag';
import { EAdministration } from '#models/administrations';
import { IAnnoncesAssociation } from '#models/annonces';
import {
  IAPINotRespondingError,
  isAPINotResponding,
} from '#models/api-not-responding';
import { IAssociation } from '#models/index';
import { formatDate } from '#utils/helpers';

const AnnoncesAssociationSection: React.FC<{
  association: IAssociation;
  annoncesAssociation: IAnnoncesAssociation | IAPINotRespondingError;
}> = ({ association, annoncesAssociation }) => {
  if (isAPINotResponding(annoncesAssociation)) {
    return (
      <AdministrationNotResponding
        administration={annoncesAssociation.administration}
        errorType={annoncesAssociation.errorType}
        title="Annonces Journal Officiel des Associations"
      />
    );
  }

  return (
    <Section
      title="Annonces Journal Officiel des Associations"
      sources={[EAdministration.DILA]}
      lastModified={annoncesAssociation.lastModified}
    >
      {annoncesAssociation.annonces.filter(
        (annonce) => annonce.typeAvisLibelle === 'Création'
      ).length === 0 && (
        <AssociationCreationNotFoundAlert association={association} />
      )}
      {annoncesAssociation.annonces.length === 0 ? (
        <div>
          Cette structure n’a aucune annonce publiée au{' '}
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
            Cette structure possède {annoncesAssociation.annonces.length}{' '}
            annonces publiées au{' '}
            <b>Journal Officiel des Associations (JOAFE)</b>
            , consolidé par la <DILA />. Pour en savoir plus, vous pouvez
            consulter{' '}
            <a
              rel="noreferrer noopener nofollow"
              target="_blank"
              href={`${routes.journalOfficielAssociations.site.recherche}?q=${association.siren}`}
            >
              la page de cette association
            </a>{' '}
            sur le site du JOAFE&nbsp;:
          </p>
          <FullTable
            head={[
              'Publication',
              'N° parution',
              'Type d’annonce',
              'Justificatif de parution',
            ]}
            body={annoncesAssociation.annonces.map((annonce) => [
              <b>{formatDate(annonce.datePublication)}</b>,
              <Tag>{annonce.numeroParution}</Tag>,
              <div className="annonce">
                <b>{annonce.typeAvisLibelle}</b>
                <div className="font-small">
                  <i>{annonce.details}</i>
                </div>
              </div>,
              <ButtonLink target="_blank" to={annonce.path} alt small>
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

export default AnnoncesAssociationSection;
