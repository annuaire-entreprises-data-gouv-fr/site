import React from 'react';
import { EAdministration } from '../../models/administration';
import {
  IAPINotRespondingError,
  isAPINotRespondingError,
} from '../../models/api-not-responding';
import { IImmatriculationRNCS } from '../../models/immatriculation';
import { inpi } from '../../public/static/logo';
import AdministrationNotResponding from '../administration-not-responding';
import ButtonLink from '../button';
import { download } from '../icon';
import { Section } from '../section';

interface IProps {
  immatriculation: IImmatriculationRNCS | IAPINotRespondingError;
}

const ImmatriculationRNCS: React.FC<IProps> = ({ immatriculation }) => {
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
          title="Justificatif d’immatriculation au RCS"
          source={EAdministration.INPI}
        >
          <div className="description">
            <div>
              Cette entité possède une fiche d'immatriculation au{' '}
              <b>Registre National du Commerce et des Sociétés (RNCS)</b> qui
              liste les entreprises enregistrées auprès des Greffes des
              tribunaux de commerce et centralisées par l'INPI.
              <p>
                Pour accéder à l’ensemble des données contenues dans un extrait
                KBIS, vous pouvez télécharger le justificatif d’immatriculation.
                Si le téléchargement échoue, vous pouvez accéder à la donnée en
                allant sur le site de l'INPI. Pour accéder à la donnée complète,
                vous <b>devrez vous créer un compte INPI</b>.
              </p>
            </div>
            <div className="logo-wrapper">{inpi}</div>
          </div>
          <div className="layout-center">
            <ButtonLink href={`/api/inpi-pdf-proxy/${immatriculation.siren}`}>
              {download} Télécharger le justificatif d'immatriculation
            </ButtonLink>
            <div className="separator" />
            <ButtonLink
              target="_blank"
              href={`${immatriculation.downloadlink}`}
              alt
            >
              ⇢ Voir la fiche sur le site de l’INPI
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

export default ImmatriculationRNCS;
