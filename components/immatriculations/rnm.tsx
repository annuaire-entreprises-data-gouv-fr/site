import React from 'react';
import { EAdministration } from '../../models/administration';
import {
  IAPINotRespondingError,
  isAPINotResponding,
} from '../../models/api-not-responding';
import { IImmatriculationRNM } from '../../models/immatriculation';
import AdministrationNotResponding from '../administration-not-responding';
import ButtonLink from '../button';
import { download } from '../icon';
import { Section } from '../section';

interface IProps {
  immatriculation: IImmatriculationRNM | IAPINotRespondingError;
}

const ImmatriculationRNM: React.FC<IProps> = ({ immatriculation }) => {
  if (isAPINotResponding(immatriculation)) {
    if (immatriculation.errorType === 404) {
      return null;
    }
    return (
      <AdministrationNotResponding
        {...immatriculation}
        title="Justificatif d’immatriculation"
      />
    );
  }
  return (
    <>
      {immatriculation.downloadlink && (
        <Section
          title="Justificatif d’immatriculation au RNM"
          source={EAdministration.CMAFRANCE}
        >
          <p>
            Cette entité possède une fiche d’immatriculation sur le{' '}
            <b>Répertoire National des Métiers (RNM)</b> qui liste les
            entreprises artisanales enreigstrées auprès des Chambres des Métiers
            et de l’Artisanat (CMA France).
          </p>
          <p>
            Pour accéder à l’ensemble des données contenues dans un extrait D1,
            vous pouvez télécharger le justificatif d’immatriculation. Si le
            téléchargement échoue, vous pouvez accéder à la donnée en allant sur
            le site de CMA France.
          </p>
          <div className="layout-center">
            <ButtonLink
              target="_blank"
              to={`${immatriculation.downloadlink}?format=pdf`}
            >
              {download} Télécharger le justificatif
            </ButtonLink>
            <div className="separator" />
            <ButtonLink
              target="_blank"
              to={`${immatriculation.downloadlink}?format=html`}
              alt
            >
              ⇢ Voir la fiche sur le site de CMA France
            </ButtonLink>
          </div>
          <style jsx>{`
            .separator {
              width: 10px;
              height: 10px;
            }
          `}</style>
        </Section>
      )}
    </>
  );
};

export default ImmatriculationRNM;
