'use client';

import routes from '#clients/routes';
import { Info } from '#components-ui/alerts';
import ButtonLink from '#components-ui/button';
import { DILA } from '#components/administrations';
import { AsyncDataSectionClient } from '#components/section/data-section/client';
import { FullTable } from '#components/table/full';
import { UniteLegalePageLink } from '#components/unite-legale-page-link';
import { EAdministration } from '#models/administrations/EAdministration';
import { IUniteLegale } from '#models/core/types';
import { formatDate } from '#utils/helpers';
import { useFetchBODACC } from 'hooks';
import React from 'react';

const AnnoncesBodacc: React.FC<{
  uniteLegale: IUniteLegale;
}> = ({ uniteLegale }) => {
  const bodacc = useFetchBODACC(uniteLegale);

  return (
    <AsyncDataSectionClient
      id="annonces-bodacc"
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
              Cette structure n’a pas fait l’objet d’une procédure collective
              (en cours ou clôturée).
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
                <strong>
                  Bulletin Officiel Des Annonces Civiles et Commerciales
                  (BODACC)
                </strong>
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
                head={['Publication', 'Details', 'Lien']}
                body={bodacc.annonces.map((annonce) => [
                  <strong>{formatDate(annonce.datePublication)}</strong>,
                  <>
                    <div>
                      <strong>{annonce.titre}</strong>
                    </div>
                    {annonce.details}
                    <div>
                      <i className="font-small">
                        Annonce n°{annonce.numeroAnnonce}, {annonce.sousTitre}
                        {annonce.tribunal && (
                          <>, publiée au {annonce.tribunal}</>
                        )}
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
          <style jsx>{`
            .annonce {
              margin: 5px 0;
            }
          `}</style>
        </>
      )}
    </AsyncDataSectionClient>
  );
};
export default AnnoncesBodacc;
