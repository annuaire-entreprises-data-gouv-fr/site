import React from 'react';
import routes from '#clients/routes';
import AssociationCreationNotFoundAlert from '#components-ui/alerts/association-creation-not-found-alert';
import ButtonLink from '#components-ui/button';
import { Tag } from '#components-ui/tag';
import { DILA } from '#components/administrations';
import { DataSection } from '#components/section/data-section';
import { FullTable } from '#components/table/full';
import { UniteLegalePageLink } from '#components/unite-legale-page-link';
import { EAdministration } from '#models/administrations/EAdministration';
import { IAssociation } from '#models/index';
import { formatDate } from '#utils/helpers';
import { useFetchJOAFE } from 'hooks';

const AnnoncesAssociationSection: React.FC<{
  uniteLegale: IAssociation;
}> = ({ uniteLegale }) => {
  const annoncesAssociation = useFetchJOAFE(uniteLegale);
  return (
    <DataSection
      title="Annonces Journal Officiel des Associations"
      sources={[EAdministration.DILA]}
      data={annoncesAssociation}
    >
      {(annoncesAssociation) => (
        <>
          {annoncesAssociation.annonces.filter(
            (annonce) => annonce.typeAvisLibelle === 'Création'
          ).length === 0 && (
            <AssociationCreationNotFoundAlert uniteLegale={uniteLegale} />
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
                <UniteLegalePageLink
                  uniteLegale={uniteLegale}
                  href={`${routes.journalOfficielAssociations.site.recherche}?q=${uniteLegale.siren}`}
                  siteName="le site du JOAFE"
                />
                &nbsp;:
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
        </>
      )}
    </DataSection>
  );
};

export default AnnoncesAssociationSection;
