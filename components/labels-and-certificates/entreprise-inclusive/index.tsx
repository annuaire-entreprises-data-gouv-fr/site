import React from 'react';
import { DataSection } from '#components/section/data-section';
import { EAdministration } from '#models/administrations/EAdministration';
import { IAPINotRespondingError } from '#models/api-not-responding';
import { IEntrepriseInclusive } from '#models/certifications/entreprise-inclusive';

export const EntrepriseInclusiveSection: React.FC<{
  entrepriseInclusive: IEntrepriseInclusive[] | IAPINotRespondingError;
}> = ({ entrepriseInclusive }) => {
  return (
    <DataSection
      id="entreprise-inclusive"
      title="Entreprise Inclusive"
      sources={[EAdministration.DINUM]}
      data={entrepriseInclusive}
      notFoundInfo={
        <p>Nous n’avons pas retrouvé les informations de cette structure.</p>
      }
    >
      {(entrepriseInclusive) => <>{JSON.stringify(entrepriseInclusive)}</>}
    </DataSection>
  );
};
