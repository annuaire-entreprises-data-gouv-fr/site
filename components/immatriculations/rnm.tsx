import React from 'react';
import { EAdministration } from '../../models/administration';
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
    if (immatriculation.type === 404) {
      return null;
    }
    return <AdministrationNotResponding {...immatriculation} />;
  }
  return (
    <>
      {immatriculation.downloadlink && (
        <Section
          title="Justificatif d’immatriculation au RNM"
          source={EAdministration.CMAFRANCE}
        >
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
          <style jsx>{`
            .separator {
              width: 10px;
              height: 10px;
            }
            .description {
              display: flex;
              margin-bottom: 20px;
              flex-direction: row;
            }
            .logo-wrapper {
              padding-left: 20px;
              width: calc(30% - 20px);
            }
            .logo-wrapper svg {
              width: 100%;
            }
            .content-container {
              margin: 20px auto 40px;
            }
            @media only screen and (min-width: 1px) and (max-width: 900px) {
              .description {
                flex-direction: column;
              }
              .logo-wrapper {
                margin: 20px auto 0;
                padding: 0;
              }
            }
          `}</style>
        </Section>
      )}
    </>
  );
};

export default ImmatriculationRNM;
