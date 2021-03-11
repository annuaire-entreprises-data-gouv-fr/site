import React from 'react';
import { IAPINotRespondingError } from '../../models/api-not-responding';
import { Section } from '../section';

const AdministrationNotResponding: React.FC<IAPINotRespondingError> = ({
  administration,
}) => (
  <Section
    title={`${administration} : transmission des données hors-service 🛑`}
    source={administration}
  >
    <p>
      Le service de l’administration qui nous transmet cette donnée ne
      fonctionne pas en ce moment.
      <br />
      <br />
      Cela vient surement d'une surcharge ponctuelle de leurs service. Merci de
      ré-essayer plus tard. Nous sommes désolé pour le dérangement.
    </p>
  </Section>
);
export default AdministrationNotResponding;
