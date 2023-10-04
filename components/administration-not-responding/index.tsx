import React from 'react';
import { Section } from '#components/section';
import { administrationsMetaData } from '#models/administrations';
import { IAPINotRespondingError } from '#models/api-not-responding';
import AdministrationNotRespondingMessage from './message';

interface IProps extends IAPINotRespondingError {
  title?: string;
  additionalInformation?: React.ReactNode;
}

const AdministrationNotResponding: React.FC<IProps> = ({
  title,
  administration,
  additionalInformation,
}) => {
  const administrationMetaData = administrationsMetaData[administration] || {};
  return (
    <Section
      title={`${
        title || administrationMetaData.long
      } : transmission des données hors-service 🛑`}
      sources={[administration]}
    >
      <AdministrationNotRespondingMessage
        administrationMetaData={administrationMetaData}
        additionalInformation={additionalInformation}
      />
    </Section>
  );
};
export default AdministrationNotResponding;
