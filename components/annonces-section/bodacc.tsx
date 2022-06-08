import React from 'react';

import { FullTable } from '../table/full';
import { EAdministration } from '../../models/administration';
import { Section } from '../section';
import AdministrationNotResponding from '../administration-not-responding';
import {
  IAPINotRespondingError,
  isAPINotResponding,
} from '../../models/api-not-responding';
import { IAnnoncesBodacc } from '../../models/annonces';
import { Tag } from '../tag';
import ButtonLink from '../button';
import { DILA } from '../administrations';
import routes from '../../clients/routes';
import { IUniteLegale } from '../../models';
import { formatDate } from '../../utils/helpers/formatting';
import Info from '../alerts/info';

const AnnoncesBodaccSection: React.FC<{
  uniteLegale: IUniteLegale;
  bodacc: IAnnoncesBodacc | IAPINotRespondingError;
}> = ({ uniteLegale, bodacc }) => {
  if (isAPINotResponding(bodacc)) {
    return (
      <AdministrationNotResponding
        administration={bodacc.administration}
        errorType={bodacc.errorType}
        title="Annonces BODACC"
      />
    );
  }

  const hasProcedure = bodacc.annonces.find(
    (annonce) => annonce.titre === 'Procédures collectives'
  );

  return (
    <Section
      title="Annonces BODACC"
      source={EAdministration.DILA}
      lastModified={bodacc.lastModified}
    >
      {hasProcedure ? (
        <Info>
          Cette entité a une procédure collective (en cours ou cloturée).
        </Info>
      ) : (
        <p>
          Cette entité n’a pas de procédure collective (en cours ou cloturée).
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
              Bulletin Officiel Des Annonces Civiles et Commerciales (BODACC)
            </b>
            , consolidé par la <DILA />. Pour en savoir plus, vous pouvez
            consulter{' '}
            <a
              rel="noreferrer noopener nofollow"
              target="_blank"
              href={`${routes.bodacc.site.recherche}/${uniteLegale.siren}`}
            >
              la page de cette entreprise
            </a>{' '}
            sur le site du BODACC&nbsp;:
          </p>
          <FullTable
            head={['Publication', 'N°', 'Details', 'Lien']}
            body={bodacc.annonces.map((annonce) => [
              /*eslint-disable*/
              <b>{formatDate(annonce.datePublication)}</b>,
              <Tag>n° {annonce.numeroAnnonce}</Tag>,
              <div className="annonce">
                <b>{annonce.titre}</b>
                <div className="font-small">
                  <i>{annonce.sousTitre}</i>
                  {annonce.tribunal && <i> publiée au {annonce.tribunal}</i>}
                </div>
                <i className="font-small">{annonce.details}</i>
              </div>,
              <ButtonLink target="_blank" to={annonce.path} alt small>
                ⇢&nbsp;Consulter
              </ButtonLink>,
              /*eslint-enable*/
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
export default AnnoncesBodaccSection;
