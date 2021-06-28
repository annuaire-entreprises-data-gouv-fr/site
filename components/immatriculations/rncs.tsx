import React from 'react';
import { EAdministration } from '../../models/administration';
import { IAPINotRespondingError } from '../../models/api-not-responding';
import { IImmatriculationRNCS } from '../../models/immatriculation';
import AdministrationNotResponding from '../administration-not-responding';
import { INPI } from '../administrations';
import ButtonLink from '../button';
import { download } from '../icon';
import { Section } from '../section';

interface IProps {
  immatriculation: IImmatriculationRNCS & IAPINotRespondingError;
}

const ImmatriculationRNCS: React.FC<IProps> = ({ immatriculation }) => {
  if (immatriculation.errorType) {
    if (immatriculation.errorType === 404) {
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
          <p>
            Cette entité possède une fiche d'immatriculation au{' '}
            <b>Registre National du Commerce et des Sociétés (RNCS)</b> qui
            liste les entreprises enregistrées auprès des Greffes des tribunaux
            de commerce et centralisées par l'
            <INPI />.
          </p>
          <p>
            Pour accéder à l’ensemble des données contenues dans un extrait
            KBIS, vous pouvez télécharger le justificatif d’immatriculation. Si
            le téléchargement échoue, vous pouvez accéder à la donnée en allant
            sur le site de l'
            <INPI />. Pour accéder à la donnée complète, vous{' '}
            <b>
              devrez vous créer un compte <INPI />
            </b>
            .
          </p>
          <div className="layout-center">
            <ButtonLink
              nofollow={true}
              href={`/api/inpi-pdf-proxy/${immatriculation.siren}`}
            >
              {download} Télécharger le justificatif d'immatriculation
            </ButtonLink>
            <div className="separator" />
            <ButtonLink
              nofollow={true}
              target="_blank"
              href={`${immatriculation.downloadlink}`}
              alt
            >
              ⇢ Voir la fiche sur le site de l’
              <INPI />
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
