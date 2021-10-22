import React from 'react';
import { EAdministration } from '../../models/administration';
import {
  IAPINotRespondingError,
  isAPINotResponding,
} from '../../models/api-not-responding';
import { IImmatriculationRNCS } from '../../models/immatriculation';
import AdministrationNotResponding from '../administration-not-responding';
import { INPI } from '../administrations';
import ButtonLink from '../button';
import ButtonInpiPdf from '../button-inpi-pdf';
import { Section } from '../section';

interface IProps {
  immatriculation: IImmatriculationRNCS | IAPINotRespondingError;
}

const ImmatriculationRNCS: React.FC<IProps> = ({ immatriculation }) => {
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
          title="Justificatif d’immatriculation au RCS"
          source={EAdministration.INPI}
        >
          <p>
            Cette entité possède une fiche d’immatriculation au{' '}
            <b>Registre National du Commerce et des Sociétés (RNCS)</b> qui
            liste les entreprises enregistrées auprès des Greffes des tribunaux
            de commerce et centralisées par l’
            <INPI />.
          </p>
          <p>
            Pour accéder à l’ensemble des données contenues dans un extrait
            KBIS, téléchargez le justificatif d’immatriculation via le{' '}
            <b>bouton ci-dessous</b>. Le téléchargement peut prendre quelques
            dizaines de secondes.
          </p>
          <p>
            Si le téléchargement échoue, vous pouvez accéder à la donnée en
            allant sur le site de l’
            <INPI />. Pour accéder à l’ensemble de la donnée en utilisant le
            site de l’
            <INPI /> vous devrez vous créer un compte <INPI />.
          </p>
          <div className="layout-center">
            <ButtonInpiPdf siren={immatriculation.siren} />
            <div className="separator" />
            <ButtonLink
              nofollow={true}
              target="_blank"
              to={`${immatriculation.downloadlink}`}
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
          `}</style>
        </Section>
      )}
    </>
  );
};

export default ImmatriculationRNCS;
