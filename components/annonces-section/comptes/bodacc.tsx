import React from 'react';
import routes from '#clients/routes';
import ButtonLink from '#components-ui/button';
import { DataSection } from '#components/section/data-section';
import { FullTable } from '#components/table/full';
import { EAdministration } from '#models/administrations/EAdministration';
import { IAnnoncesBodacc } from '#models/annonces';
import { IAPILoading } from '#models/api-loading';
import { IAPINotRespondingError } from '#models/api-not-responding';
import { IUniteLegale } from '#models/core/types';
import { formatDate } from '#utils/helpers';
import { useFetchBODACC } from 'hooks';

const ComptesBodacc: React.FC<{
  uniteLegale: IUniteLegale;
}> = ({ uniteLegale }) => {
  const bodacc = useFetchBODACC(uniteLegale);
  return <AnnoncesBodaccSection uniteLegale={uniteLegale} bodacc={bodacc} />;
};

const AnnoncesBodaccSection: React.FC<{
  uniteLegale: IUniteLegale;
  bodacc: IAnnoncesBodacc | IAPINotRespondingError | IAPILoading;
}> = ({ uniteLegale, bodacc }) => {
  return (
    <DataSection
      title="Dépôts des comptes (BODACC C)"
      sources={[EAdministration.DILA]}
      data={bodacc}
    >
      {(bodacc) => (
        <>
          {bodacc.comptes.length === 0 ? (
            <div>
              Aucun dépôt de compte publié au{' '}
              <a
                target="_blank"
                rel="noreferrer noopener"
                href={routes.bodacc.site.recherche}
                aria-label="Bulletin Officiel Des Annonces Civiles et Commerciales"
              >
                BODACC
              </a>
              .
            </div>
          ) : (
            <FullTable
              head={['Publication', 'Details', 'Annonce']}
              body={bodacc.comptes.map((annonce) => [
                <strong>{formatDate(annonce.datePublication)}</strong>,
                <>
                  <div>
                    <strong>{annonce.titre}</strong>
                  </div>
                  {annonce.details}
                  <div>
                    <i className="font-small">
                      Annonce n°{annonce.numeroAnnonce}, {annonce.sousTitre}
                      {annonce.tribunal && <>, publiée au {annonce.tribunal}</>}
                    </i>
                  </div>
                </>,
                <ButtonLink target="_blank" to={annonce.path} alt small>
                  ⇢&nbsp;Consulter
                </ButtonLink>,
              ])}
            />
          )}
        </>
      )}
    </DataSection>
  );
};
export default ComptesBodacc;
