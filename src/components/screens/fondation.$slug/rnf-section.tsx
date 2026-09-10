import type React from "react";
import { Section } from "#/components/section";
import { TwoColumnTable } from "#/components/table/simple";
import { EAdministration } from "#/models/administrations/e-administration";
import type { IFondation } from "#/models/core/fondations.types";

const FondationRNFSection: React.FC<{
  fondation: IFondation;
}> = ({ fondation }) => {
  const data = [["Objet social", <p>{fondation.socialObject}</p>]];

  return (
    <div id="fondation">
      <Section
        sources={[EAdministration.MI]}
        title="Registre national des fonds et fondations"
      >
        <TwoColumnTable body={data} />
      </Section>
    </div>
  );
};

export default FondationRNFSection;
