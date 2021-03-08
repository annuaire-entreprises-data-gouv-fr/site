import React from 'react';
import {
  IAPINotRespondingError,
  isAPINotRespondingError,
} from '../../models/api-not-responding';
import { IImmatriculationRNM } from '../../models/immatriculation';
import { cma } from '../../public/static/logo';
import AdministrationNotResponding from '../administration-not-responding';
import ButtonLink from '../button';
import { download } from '../icon';
import { Section } from '../section';

interface IProps {
  immatriculation: IImmatriculationRNM | IAPINotRespondingError;
}

const ImmatriculationRNM: React.FC<IProps> = ({ immatriculation }) => {
  if (isAPINotRespondingError(immatriculation)) {
    return <AdministrationNotResponding {...immatriculation} />;
  }
  return (
    <>
      {immatriculation.downloadlink && (
        <Section title="Cette entité est immatriculée au RM">
          <div className="description">
            <div>
              Cette entité possède une fiche d'immatriculation sur le{' '}
              <b>Répertoire National des Métiers (RNM)</b> qui liste les
              entreprises artisanales enreigstrées auprès des Chambres des
              Métiers et de l'Artisanat (CMA France).
            </div>
            <div className="logo-wrapper">{cma}</div>
          </div>
          <div className="layout-center">
            <ButtonLink
              target="_blank"
              href={`${immatriculation.downloadlink}?format=pdf`}
            >
              {download} Télécharger le justificatif
            </ButtonLink>
            <div className="separator" />
            <ButtonLink
              target="_blank"
              href={`${immatriculation.downloadlink}?format=html`}
              alt
            >
              ⇢ Voir la fiche sur le site de CMA France
            </ButtonLink>
          </div>
        </Section>
      )}
    </>
  );
};

export default ImmatriculationRNM;
