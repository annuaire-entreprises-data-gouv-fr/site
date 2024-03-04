import React from 'react';
import routes from '#clients/routes';
import AssociationCreationNotFoundAlert from '#components-ui/alerts-with-explanations/association-creation-not-found-alert';
import ButtonLink from '#components-ui/button';
import { DILA } from '#components/administrations';
import { ClientDataSection } from '#components/section/client-data-section';
import { FullTable } from '#components/table/full';
import { UniteLegalePageLink } from '#components/unite-legale-page-link';
import { EAdministration } from '#models/administrations/EAdministration';
import { IAssociation } from '#models/core/types';
import { formatDate } from '#utils/helpers';
import { useFetchJOAFE } from 'hooks';

const AnnoncesJOAFESection: React.FC<{
  uniteLegale: IAssociation;
}> = ({ uniteLegale }) => {
  const annoncesAssociation = useFetchJOAFE(uniteLegale);
  return (
    <ClientDataSection
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
                <strong>Journal Officiel des Associations (JOAFE)</strong>
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
                  'Type d’annonce',
                  'Justificatif de parution',
                ]}
                body={annoncesAssociation.annonces.map((annonce) => [
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
          )}
        </>
      )}
    </ClientDataSection>
  );
};

export default AnnoncesJOAFESection;
