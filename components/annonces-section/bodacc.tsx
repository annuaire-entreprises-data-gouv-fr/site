import React from 'react';
import routes from '#clients/routes';
import Info from '#components-ui/alerts/info';
import ButtonLink from '#components-ui/button';
import { Tag } from '#components-ui/tag';
import { DILA } from '#components/administrations';
import { DataSection } from '#components/section/data-section';
import { FullTable } from '#components/table/full';
import { UniteLegalePageLink } from '#components/unite-legale-page-link';
import { EAdministration } from '#models/administrations/EAdministration';
import { IAnnoncesBodacc } from '#models/annonces';
import { IAPILoading } from '#models/api-loading';
import { IAPINotRespondingError } from '#models/api-not-responding';
import { IUniteLegale } from '#models/index';
import { formatDate } from '#utils/helpers';
import { useFetchBODACC } from 'hooks';

const AnnoncesBodacc: React.FC<{
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
      title="Annonces BODACC"
      sources={[EAdministration.DILA]}
      data={bodacc}
    >
      {(bodacc) => (
        <>
          {bodacc.procedures.length > 0 ? (
            <Info>
              Cette structure a une procédure collective (en cours ou cloturée).
              <ul>
                {bodacc.procedures.map((procedure) => (
                  <li key={procedure.details}>
                    le {procedure.date} : {procedure.details}
                  </li>
                ))}
              </ul>
            </Info>
          ) : (
            <p>
              Cette structure n’a pas de procédure collective (en cours ou
              cloturée).
            </p>
          )}
          {bodacc.annonces.length === 0 ? (
            <div>
              Elle n’a aucune annonce publiée au{' '}
              <a
                target="_blank"
                rel="noreferrer noopener"
                href={routes.bodacc.site.recherche}
              >
                Bulletin Officiel Des Annonces Civiles et Commerciales (BODACC)
              </a>
              .
            </div>
          ) : (
            <>
              <p>
                Elle possède {bodacc.annonces.length} annonces publiées au{' '}
                <b>
                  Bulletin Officiel Des Annonces Civiles et Commerciales
                  (BODACC)
                </b>
                , consolidé par la <DILA />. Pour en savoir plus, vous pouvez
                consulter{' '}
                <UniteLegalePageLink
                  uniteLegale={uniteLegale}
                  href={`${routes.bodacc.site.recherche}/${uniteLegale.siren}`}
                  siteName="le site du BODACC"
                />
                &nbsp;:
              </p>
              <FullTable
                head={['Publication', 'N°', 'Details', 'Lien']}
                body={bodacc.annonces.map((annonce) => [
                  <b>{formatDate(annonce.datePublication)}</b>,
                  <Tag>n°&nbsp;{annonce.numeroAnnonce}</Tag>,
                  <div className="annonce">
                    <b>{annonce.titre}</b>
                    <div className="font-small">
                      <i>{annonce.sousTitre}</i>
                      {annonce.tribunal && (
                        <i> publiée au {annonce.tribunal}</i>
                      )}
                    </div>
                    <i className="font-small">{annonce.details}</i>
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
export default AnnoncesBodacc;
