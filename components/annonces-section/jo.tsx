import React from 'react';

import { FullTable } from '../table/full';
import { EAdministration } from '../../models/administration';
import { Section } from '../section';
import AdministrationNotResponding from '../administration-not-responding';
import {
  IAPINotRespondingError,
  isAPINotResponding,
} from '../../models/api-not-responding';
import { IAnnoncesBodacc, IAnnoncesJO } from '../../models/annonces';
import { Tag } from '../tag';
import ButtonLink from '../button';
import { DILA } from '../administrations';
import routes from '../../clients/routes';
import { IUniteLegale } from '../../models';

const AnnoncesJOSection: React.FC<{
  uniteLegale: IUniteLegale;
  jo: IAnnoncesJO | IAPINotRespondingError;
}> = ({ uniteLegale, jo }) => {
  if (isAPINotResponding(jo)) {
    return (
      <AdministrationNotResponding
        administration={jo.administration}
        errorType={jo.errorType}
        title="Annonces Journal Officiel des Associations"
      />
    );
  }

  return (
    <Section
      title="Annonces Journal Officiel des Associations"
      source={EAdministration.DILA}
      lastModified={jo.lastModified}
    >
      {jo.annonces.length === 0 ? (
        <div>
          Cette entité n’a aucune annonce publiée au{' '}
          <b>Journal Officiel des Associations (JOAFE)</b>.
        </div>
      ) : (
        <>
          <p>
            Cette entité possède {jo.annonces.length} annonces publiées au{' '}
            <b>Journal Officiel des Associations (JOAFE)</b>
            , consolidé par la <DILA />. Pour en savoir plus, vous pouvez
            consulter{' '}
            <a
              rel="noreferrer noopener nofollow"
              target="_blank"
              href={`${routes.journalOfficielAssociations.site.recherche}/${uniteLegale.siren}`}
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
            body={jo.annonces.map((annonce) => [
              /*eslint-disable*/
              <b>{annonce.datePublication}</b>,
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
export default AnnoncesJOSection;
