import React from 'react';
import {
  IAPINotRespondingError,
  isAPINotRespondingError,
} from '../../models/api-not-responding';
import { IImmatriculationRNCS } from '../../models/immatriculation';
import { inpi } from '../../public/static/logo';
import AdministrationNotResponding from '../administration-not-responding';
import ButtonLink from '../button';
import { Section } from '../section';

interface IProps {
  immatriculation: IImmatriculationRNCS | IAPINotRespondingError;
}

const ImmatriculationRNCS: React.FC<IProps> = ({ immatriculation }) => {
  if (isAPINotRespondingError(immatriculation)) {
    return <AdministrationNotResponding {...immatriculation} />;
  }
  return (
    <>
      {immatriculation.downloadlink && (
        <Section title="Cette entité est immatriculée au RCS">
          <div className="description">
            <div>
              Cette entité possède une fiche d'immatriculation sur le{' '}
              <b>Registre National du Commerce et des Sociétés (RNCS)</b> qui
              liste les entreprises enregistrées auprès des Greffes des
              tribunaux de commerce et centralisées par l'INPI.
            </div>
            <div className="logo-wrapper">{inpi}</div>
          </div>
          <div className="layout-center">
            <div className="separator" />
            <ButtonLink
              target="_blank"
              href={`${immatriculation.downloadlink}`}
              alt
            >
              ⇢ Voir la fiche sur le site de l’INPI
            </ButtonLink>
          </div>
        </Section>
      )}
    </>
  );
};

export default ImmatriculationRNCS;
