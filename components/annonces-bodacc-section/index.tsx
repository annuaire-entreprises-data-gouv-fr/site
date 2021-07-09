import React from 'react';

import { FullTable } from '../table/full';
import { EAdministration } from '../../models/administration';
import { Section } from '../section';
import AdministrationNotResponding from '../administration-not-responding';
import {
  IAPINotRespondingError,
  isAPINotResponding,
} from '../../models/api-not-responding';
import { IAnnoncesBodacc } from '../../models/annonces-bodacc';
import { Tag } from '../tag';
import ButtonLink from '../button';
import { DILA } from '../administrations';
import routes from '../../clients/routes';
import { IUniteLegale } from '../../models';

const AnnoncesBodaccSection: React.FC<{
  uniteLegale: IUniteLegale;
  annonces: IAnnoncesBodacc[] | IAPINotRespondingError;
}> = ({ uniteLegale, annonces }) => {
  if (isAPINotResponding(annonces)) {
    return (
      <AdministrationNotResponding
        administration={annonces.administration}
        errorType={annonces.errorType}
      />
    );
  }

  return (
    <Section title="Annonces BODACC" source={EAdministration.DILA}>
      {annonces.length === 0 ? (
        <div>
          Cette entité n’a aucune annonce publiée au{' '}
          <b>Bulletin Officiel Des Annonces Civiles et Commerciales (BODACC)</b>
          .
        </div>
      ) : (
        <>
          <p>
            Cette entité possède {annonces.length} annonces publiées au{' '}
            <b>
              Bulletin Officiel Des Annonces Civiles et Commerciales (BODACC)
            </b>
            , consolidé par la <DILA />. Pour en savoir plus, vous pouvez
            consulter{' '}
            <a
              rel="referrer noopener nofollow"
              target="_blank"
              href={`${routes.bodacc.site.recherche}/${uniteLegale.siren}`}
            >
              la page de cette entreprise
            </a>{' '}
            sur le site du BODACC&nbsp;:
          </p>
          <FullTable
            head={['Publication', 'N°', 'Details', 'Lien']}
            body={annonces.map((annonce) => [
              <b>{annonce.datePublication}</b>,
              <Tag>n° {annonce.numeroAnnonce}</Tag>,
              <div className="annonce">
                <b>{annonce.titre}</b>
                <div className="font-small">
                  <i>{annonce.sousTitre}</i>
                  {annonce.tribunal && <i> publiée au {annonce.tribunal}</i>}
                </div>
                <i className="font-small">{annonce.details}</i>
              </div>,
              <ButtonLink target="_blank" href={annonce.path} alt small>
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
export default AnnoncesBodaccSection;
