import type React from "react";
import { Section } from "#/components/section";
import { administrationsMetaData } from "#/models/administrations";
import type { IAPINotRespondingError } from "#/models/api-not-responding";
import AdministrationNotRespondingMessage from "./message";

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
      sources={[administration]}
      title={`${
        title || administrationMetaData.long
      } : transmission des données hors-service 🛑`}
    >
      <AdministrationNotRespondingMessage
        administrationMetaData={administrationMetaData}
      />
    </Section>
  );
};
export default AdministrationNotResponding;
