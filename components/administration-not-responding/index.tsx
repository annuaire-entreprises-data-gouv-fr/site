import React from 'react';
import { administrationsMetaData } from '../../models/administration';
import { IAPINotRespondingError } from '../../models/api-not-responding';
import ButtonLink from '../button';
import { Section } from '../section';

interface IProps extends IAPINotRespondingError {
  title?: string;
}

const AdministrationNotResponding: React.FC<IProps> = ({
  title,
  administration,
}) => {
  const administrationMetaData = administrationsMetaData[administration] || {};
  return (
    <Section
      title={`${
        title || administrationMetaData.long
      } : transmission des données hors-service 🛑`}
      source={administration}
    >
      <p>
        Le service de l’administration qui nous transmet cette donnée ne
        fonctionne pas en ce moment.
        <br />
        <br />
        Cela vient probablement d'une surcharge ponctuelle de leurs services.
        Merci de ré-essayer plus tard. Nous sommes désolés pour le dérangement.
        <br />
        Pour en savoir plus sur l'état du service,{' '}
        <a
          href={`/administration/${administrationMetaData.slug}#acces`}
          target="_blank"
          rel="noreferrer noopener"
        >
          consultez cette page
        </a>
        .
      </p>
      {administrationMetaData.site && (
        <div className="layout-center">
          <ButtonLink to={administrationMetaData.site}>
            Consulter le site de l’administration
          </ButtonLink>
        </div>
      )}
    </Section>
  );
};
export default AdministrationNotResponding;
