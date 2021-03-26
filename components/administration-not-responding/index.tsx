import React from 'react';
import routes from '../../clients/routes';
import { administrationsMetaData } from '../../models/administration';
import { IAPINotRespondingError } from '../../models/api-not-responding';
import { Section } from '../section';

const AdministrationNotResponding: React.FC<IAPINotRespondingError> = ({
  administration,
}) => {
  const administrationMetaData = administrationsMetaData[administration] || {};
  return (
    <Section
      title={`${administrationMetaData.long} : transmission des données hors-service 🛑`}
      source={administration}
    >
      <p>
        Le service de l’administration qui nous transmet cette donnée ne
        fonctionne pas en ce moment.
        <br />
        <br />
        Cela vient surement d'une surcharge ponctuelle de leurs service. Merci
        de ré-essayer plus tard. Nous sommes désolé pour le dérangement.
        <br />
        Pour en savoir plus sur l'état du service, vous pouvez{' '}
        <a
          href={`${routes.monitoring.history}${administrationMetaData.monitoringSlug}`}
          target="_blank"
          rel="noreferrer noopener"
        >
          consulter cette page
        </a>
        .
      </p>
    </Section>
  );
};
export default AdministrationNotResponding;
